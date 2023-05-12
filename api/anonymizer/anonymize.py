from .asscRule import Rule
import random
import collections
import math
import os
import numpy as np
import json
import pandas as pd
pd.options.mode.chained_assignment = None  # default='warn'


class Anonymizer:
    def __init__(self, args):
        # k value of k-anoynimity
        self.k = args['k']
        # confidence value from user input
        self.conf = args['conf']
        # support value from user input
        self.sup = args['sup']
        self.qsi = args['qsi']

        # init the result folder
        self.anon_folder = os.path.join('results', "test")
        os.makedirs(self.anon_folder, exist_ok=True)

        self.ds = pd.read_csv(args['input'])
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
            return 0 if m >= k or m == 0 else 2 * k - m

        def check_rule(s, g, migrated_count):
            aff_rules = self.rule.get_affected_rules(s, self.quasiID)
            if aff_rules == []:
                return True, [], []
            affected_budgets = self.rule.rule_care.loc[aff_rules, 'budget'].tolist(
            )
            assert (len(aff_rules) == len(affected_budgets))

            new_budgets = [budget - (migrated_count * self.sup / self.n)
                           for budget in affected_budgets]

            return all(budget > 1e-03 for budget in new_budgets), new_budgets, aff_rules
            # initialize variables

        def calculate_local_risk(current_migrate_from_selg, current_num_records_to_migrate):
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
            return new_selg_risk, new_group_risk

        max_risk_reduction = 0
        selected_group = None
        selected_num_records_to_migrate = None
        selected_migrate_from_selg = None
        migrate_count = 0
        new_budget = None
        affected_rule = None

        # calculate the risk of the selected group
        SelG_risk = risk(self.freq[SelG])

        # loop through the remaining groups to find the most useful group to migrate to

        for id, group in enumerate(remaining_groups):
            if self.freq[group] == 0:
                continue
            # print(id)
            # calculate the risk of the group
            group_risk = risk(self.freq[group])

            # SelG is always unsafe
            # calculate the number of tuples to migrate from SelG to group
            if group_risk > 0:  # SelG is unsafe and group is unsafe
                # migrate from selG to group
                if not self.is_received[SelG]:
                    migrate_from_selg = True
                    num_records_to_migrate = min(
                        self.freq[SelG], k - self.freq[group])
                    new_selg_risk, new_group_risk = calculate_local_risk(
                        migrate_from_selg, num_records_to_migrate)
                    risk_reduction = SelG_risk + group_risk - new_selg_risk - new_group_risk
                    if abs(risk_reduction) > max_risk_reduction:
                        ok, cur_new_budget, cur_aff_rule = check_rule(
                            SelG, group, num_records_to_migrate)
                        if ok:
                            max_risk_reduction = abs(risk_reduction)
                            selected_group = group
                            selected_migrate_from_selg = True
                            selected_num_records_to_migrate = num_records_to_migrate
                            new_budget = cur_new_budget
                            affected_rule = cur_aff_rule
                            if (new_selg_risk + new_group_risk) == 0:
                                break

                # Migrate from group to SelG
                if not self.is_received[group]:
                    migrate_from_selg = False
                    num_records_to_migrate = min(
                        self.freq[group], k - self.freq[SelG])
                    new_selg_risk, new_group_risk = calculate_local_risk(
                        migrate_from_selg, num_records_to_migrate)
                    risk_reduction = SelG_risk + group_risk - new_selg_risk - new_group_risk
                    if abs(risk_reduction) > max_risk_reduction:
                        ok, cur_new_budget, cur_aff_rule = check_rule(
                            group, SelG, num_records_to_migrate)
                        if ok:
                            max_risk_reduction = abs(risk_reduction)
                            selected_group = group
                            selected_migrate_from_selg = False
                            selected_num_records_to_migrate = num_records_to_migrate
                            new_budget = cur_new_budget
                            affected_rule = cur_aff_rule
                            if (new_selg_risk + new_group_risk) == 0:
                                break

            elif group_risk == 0:  # SelG is unsafe and group is safe, can only move from SelG to group all of it tuple
                migrate_from_selg = True
                num_records_to_migrate = self.freq[SelG]
                new_selg_risk, new_group_risk = calculate_local_risk(
                    migrate_from_selg, num_records_to_migrate)
                risk_reduction = SelG_risk + group_risk - new_selg_risk - new_group_risk
                if abs(risk_reduction) > max_risk_reduction:
                    ok, cur_new_budget, cur_aff_rule = check_rule(
                        SelG, group, num_records_to_migrate)
                    if ok:
                        max_risk_reduction = abs(risk_reduction)
                        selected_group = group
                        selected_migrate_from_selg = True
                        selected_num_records_to_migrate = num_records_to_migrate
                        new_budget = cur_new_budget
                        affected_rule = cur_aff_rule
                        if (new_selg_risk + new_group_risk) == 0:
                            break

            # calculate the new risk of SelG and the group after migrating tuples

        return selected_group, selected_migrate_from_selg, selected_num_records_to_migrate, new_budget, affected_rule

    def k_anoymize(self):

        def disperse(selg):
            non_empty_sg = [id for id in range(
                len(SG)) if self.freq[SG[id]] > 0]
            if len(non_empty_sg) == 0:
                return

            id = random.choice(non_empty_sg)
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
                self.is_received[selg] = True
                self.freq[selg] += migrate_count
                self.freq[g] -= migrate_count
                for i in range(migrate_count):
                    self.index_map[selg].append(self.index_map[g].pop())
            assert (self.freq[selg] == len(self.index_map[selg]))
            assert (self.freq[g] == len(self.index_map[g]))

            self.rule.rule_care.loc[affected_rule, 'budget'] = new_budget

        SG = list(filter(lambda g: self.freq[g] >= self.k, self.groups))
        UG = list(filter(lambda g: self.freq[g] < self.k, self.groups))
        UG_BIG = list(filter(lambda g: self.freq[g] > self.k//2, UG))
        UG_BIG = list(sorted(UG_BIG, key=lambda x: self.freq[x], reverse=True))
        UG_SMALL = list(filter(lambda g: self.freq[g] <= self.k//2, UG))
        UG_SMALL = list(sorted(UG_SMALL, key=lambda x: self.freq[x]))
        assert (len(SG) + len(UG) == len(self.groups))
        assert (len(UG_BIG) + len(UG_SMALL) == len(UG))
        UG = list(sorted(UG, key=lambda x: self.freq[x]))
        self.is_received = {key: False for key in self.freq}

        SelG = None
        UM = []
        while len(UG) > 0 or SelG is not None:
            if SelG is None:
                SelG = UG.pop(0)
                if SelG in UG_SMALL:
                    UG_SMALL.remove(SelG)
                if SelG in UG_BIG:
                    UG_BIG.remove(SelG)
                assert (len(UG_BIG) + len(UG_SMALL) == len(UG))
            if self.freq[SelG] <= self.k//2:
                remaining_groups = UG_BIG + UG_SMALL + SG
            else:
                remaining_groups = UG_SMALL + UG_BIG + SG
            print('Choosing SelG: ', SelG, self.freq[SelG])
            g, migrate_from_selg, migrate_count, new_budget, affected_rule = self.find_group_to_migrate(
                SelG, remaining_groups, self.k)

            print('Have matched with: ', g)

            if g is None:
                UM.append(SelG)
                SelG = None
            else:
                do_migrate_tuples(SelG, g, migrate_count,
                                  migrate_from_selg, affected_rule, new_budget)

                if isSafe(SelG):
                    SG.append(SelG)
                    SelG = None

                if g not in UG:
                    continue

                if isSafe(g):
                    if g in UG:
                        UG.remove(g)
                    if g in UG_BIG:
                        UG_BIG.remove(g)
                    if g in UG_SMALL:
                        UG_SMALL.remove(g)
                    SG.append(g)
                else:
                    if SelG is None:
                        SelG = g
                        UG.remove(g)
                        if SelG in UG_SMALL:
                            UG_SMALL.remove(SelG)
                        elif SelG in UG_BIG:
                            UG_BIG.remove(SelG)

            print('Safe group: ', len(SG))
            print('Unsafe group: ', len(UG))
            print('UM: ', len(UM))

        # assert sum(self.freq.values()) == self.n
        if len(UM) > 0:
            for um in UM:
                disperse(um)

    def last_update(self):
        for group, indexes in self.index_map.items():
            values = list(group)
            for i in indexes:
                self.ds.loc[i, self.quasiID] = values

    def anonymize(self):
        print(f'Start anonymizing with {self.k}')
        self.groups, self.index_map, self.freq = self.prepare_input(self.ds)
        print(f'We have {len(self.freq)} groups')
        self.rule = Rule(self.ds, self.quasiID, self.sup, self.conf)
        print('Start mining rules\n')
        self.rule.generate_rules()
        self.rule.calculate_budgets()
        self.k_anoymize()
        assert all(val >= self.k or val == 0 for val in self.freq.values())
        self.last_update()

    def output(self, path, rule_path, sec_level, rule_level):
        self.ds.to_csv(path, index=False)
        results = {}
        rules = self.rule.rule_care[['antecedents', 'consequents']].to_dict(orient='records')
        for i, rule in enumerate(rules):
            rule['antecedents'] = list(rule['antecedents'])
            rule['consequents'] = list(rule['consequents'])
            rules[i] = rule
        results = {'k': self.k,'no_rule':len(rules), 'sec_level':sec_level, 'rule_level': rule_level, 'rules': rules}
        with open(rule_path, "w") as file:
            # Write the rules as JSON to the file
            json.dump(results, file)
        print(rule_path)
