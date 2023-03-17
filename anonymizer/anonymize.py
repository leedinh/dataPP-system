import numpy as np
import pandas as pd
import os
import math
import collections
import random
from apriori import Rule


class Anonymizer:
    def __init__(self, input, k: int, conf: float, sup: float, qsi: list(), output):
        # k value of k-anoynimity
        self.k = k
        # confidence value from user input
        self.conf = conf
        # support value from user input
        self.sup = sup
        self.qsi = qsi

        # init the result folder
        self.anon_folder = os.path.join('results', "test")
        os.makedirs(self.anon_folder, exist_ok=True)

        self.ds = pd.read_csv(input)
        self.ds.replace("?", pd.NaT, inplace=True)
        self.ds.dropna(inplace=True)
        self.n = len(self.ds)

        # get list of column indexes as qsi-identifier
        if self.qsi is None:
            raise Exception("You must provide a QSI list")
        columns = list(self.ds.columns)
        self.quasiID = [columns[i] for i in self.qsi]

    def prepare_input(self, input):

        groups = input.groupby(self.quasiID)
        indexes = groups.apply(lambda x: list(x.index))
        index_dict = dict(zip(groups.groups.keys(), indexes))

        index_sizes = groups.apply(lambda x: len(x.index))
        freq = dict(zip(groups.groups.keys(), index_sizes))
        assert (len(groups) == len(index_dict) == len(freq))
        return groups.groups.keys(), index_dict, freq

    def find_group_to_migrate(self, SelG, remaining_groups, k):

        def risk(m):
            return 0 if m >= k else 2 * k - m

        def check_rule(s, g, migrated_count):
            aff_rules = self.rule.get_affected_rules(s, g)
            affected_budgets = self.rule.rule_care.loc[aff_rules, 'budget'].tolist(
            )
            assert (len(aff_rules) == len(affected_budgets))

            new_budget = [budget - (migrated_count / self.n)
                          for budget in affected_budgets]
            return all(self.rule.rule_care['budget'] > 0), new_budget, aff_rules
            # initialize variables

        max_risk_reduction = 0
        selected_group = None
        migrate_from_selg = False
        migrate_count = 0
        new_budget = None
        affected_rule = None

        # calculate the risk of the selected group
        SelG_risk = risk(self.freq[SelG])

        # loop through the remaining groups to find the most useful group to migrate to
        for group in remaining_groups:
            # calculate the risk of the group
            group_risk = risk(self.freq[group])

            # SelG is always unsafe
            # calculate the number of tuples to migrate from SelG to group
            selg_to_g_count = 0

            if group_risk > 0:  # SelG is unsafe and group is unsafe

                # migrate from selG to group
                if (self.freq[SelG] >= self.freq[group] or self.freq[SelG] >= k - self.freq[group]) and not self.is_received[SelG]:
                    current_migrate_from_selg = True
                    current_num_records_to_migrate = min(
                        self.freq[SelG], k - self.freq[group])

                # migrate from group to selG
                elif (self.freq[group] > self.freq[SelG] or self.freq[group] >= k - self.freq[SelG]) and not self.is_received[group]:
                    current_migrate_from_selg = False
                    current_num_records_to_migrate = min(
                        self.freq[group], k - self.freq[SelG])

            elif group_risk == 0:  # SelG is unsafe and group is safe, can only move from SelG to group all of it tuple
                current_migrate_from_selg = True
                current_num_records_to_migrate = self.freq[SelG]

            # calculate the new risk of SelG and the group after migrating tuples
            if current_migrate_from_selg:  # from selg to group
                new_selg_risk = risk(
                    self.freq[SelG] - current_num_records_to_migrate)
                new_group_risk = risk(
                    self.freq[group] + current_num_records_to_migrate)
            else:
                new_selg_risk = risk(
                    self.freq[SelG] + current_num_records_to_migrate)
                new_group_risk = risk(
                    self.freq[group] - current_num_records_to_migrate)

            # Calculate risk reduction
            risk_reduction = SelG_risk + group_risk - new_selg_risk - new_group_risk

            # check if this group is more useful than the current selected group
            if abs(risk_reduction) > max_risk_reduction:
                ok, cur_new_budget, cur_aff_rule = check_rule(
                    SelG, group, current_num_records_to_migrate)

                if not ok:
                    continue

                max_risk_reduction = risk_reduction
                selected_group = group
                migrate_from_selg = current_migrate_from_selg
                migrate_count = current_num_records_to_migrate
                new_budget = cur_new_budget
                affected_rule = cur_aff_rule

            if new_selg_risk == 0 or new_group_risk == 0:
                # selected_group = group
                # migrate_from_selg = current_migrate_from_selg
                # migrate_count = current_num_records_to_migrate
                break

        return selected_group, migrate_from_selg, migrate_count, new_budget, affected_rule

    def k_anoymize(self):

        def disperse(selg):
            id = random.randint(0, len(SG)-1)
            self.index_map[SG[id]] += self.index_map[selg]
            self.index_map[selg] = []
            self.freq[SG[id]] += self.freq[selg]
            self.freq[selg] = 0

        def isSafe(group):
            return self.freq[group] >= self.k or self.freq[group] == 0

        # Update number of tupple of each group after calculation
        def do_migrate_tuples(selg, g, migrate_count, migrate_from_selg, affected_rule, new_budget):
            if migrate_from_selg:  # from selg to g
                self.is_received[g] = True
                self.freq[selg] -= migrate_count
                self.freq[g] += migrate_count
                for i in range(migrate_count):
                    self.index_map[g].append(self.index_map[selg].pop())
            else:  # from g to selg
                self.is_received[self] = True
                self.freq[selg] += migrate_count
                self.freq[g] -= migrate_count
                for i in range(migrate_count):
                    self.index_map[selg].append(self.index_map[g].pop())
            assert (self.freq[selg] == len(self.index_map[selg]))
            assert (self.freq[g] == len(self.index_map[g]))

            self.ds.loc[affected_rule, 'budgets'] = new_budget

        SG = list(filter(lambda g: self.freq[g] >= self.k, self.groups))
        UG = list(filter(lambda g: self.freq[g] < self.k, self.groups))
        UG_BIG = list(filter(lambda g: len(g) > self.k//2, UG))
        UG_SMALL = list(filter(lambda g: len(g) <= self.k//2, UG))
        assert (len(SG) + len(UG) == len(self.groups))
        assert (len(UG_BIG) + len(UG_SMALL) == len(UG))
        UG = list(sorted(UG, key=lambda x: self.freq[x]))
        self.is_received = {key: False for key in self.freq}

        # print(UG)

        SelG = None
        UM = []
        while len(UG) > 0 or SelG is not None:
            print(len(SG), len(UG))
            if SelG is None:
                SelG = UG.pop(0)
                if SelG in UG_SMALL:
                    UG_SMALL.remove(SelG)
                elif SelG in UG_BIG:
                    UG_BIG.remove(SelG)
                assert (len(UG_BIG) + len(UG_SMALL) == len(UG))
            if self.freq[SelG] <= self.k//2:
                remaining_groups = UG_BIG + UG_SMALL + SG
            else:
                remaining_groups = UG_SMALL + UG_BIG + SG
            assert (len(remaining_groups) + len(UM) == len(UG) + len(SG))

            g, migrate_from_selg, migrate_count, new_budget, affected_rule = self.find_group_to_migrate(
                SelG, remaining_groups, self.k)

            if g is None:
                UM.append(SelG)
                SelG = None
            else:
                do_migrate_tuples(SelG, g, migrate_count,
                                  migrate_from_selg, affected_rule, new_budget)

                if isSafe(SelG):
                    if SelG in UG:
                        UG.remove(SelG)
                    if SelG in UG_BIG:
                        UG_BIG.remove(SelG)
                    if SelG in UG_SMALL:
                        UG_SMALL.remove(SelG)
                    if self.freq[SelG] > 0:
                        SG.append(SelG)

                if isSafe(g):
                    if g in UG:
                        UG.remove(g)
                    if g in UG_BIG:
                        UG_BIG.remove(g)
                    if g in UG_SMALL:
                        UG_SMALL.remove(g)
                    if self.freq[g] > 0:
                        SG.append(g)
                if isSafe(SelG) and isSafe(g):
                    SelG = None
                else:
                    if not isSafe(g):
                        SelG = g

        # assert sum(self.freq.values()) == self.n
        if len(UM) > 0:
            for um in UM:
                self.disperse(um)

    def last_update(self):
        for group, indexes in self.index_map.items():
            values = list(group)
            for i in indexes:
                self.ds.loc[i, self.quasiID] = values

    def anonymize(self):
        self.groups, self.index_map, self.freq = self.prepare_input(self.ds)

        self.rule = Rule(self.ds, self.quasiID, self.sup, self.conf)
        self.rule.generate_rules()
        self.rule.calculate_budgets()
        self.k_anoymize()
        assert all(val >= self.k or val == 0 for val in self.freq.values())
        self.last_update()

    def output(self, path):
        self.ds = self.ds.drop('budgets', axis=1)
        self.ds.to_csv(path, index=False)
