import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules
from mlxtend.preprocessing import TransactionEncoder


class Rule:
    def __init__(self, df: pd.DataFrame, quasi_identifiers: list[str], min_support: float, min_confidence: float):
        self.df = df
        self.quasi_identifiers = quasi_identifiers
        self.min_sup = min_support
        self.min_conf = min_confidence

        self.df = self.df.applymap(str)  # convert all values to strings
        self.df = self.df.apply(lambda x: x.apply(
            self.concat_with_column_name, column_name=x.name))
        self.transactions = self.df.values.tolist()
        self.te = TransactionEncoder()
        self.te_ary = self.te.fit(
            self.transactions).transform(self.transactions)
        self.df = pd.DataFrame(self.te_ary, columns=self.te.columns_)

    def concat_with_column_name(self, value, column_name):
        return str(column_name) + ':' + str(value)

    def get_affected_rules(self, selg, g):
        # Find the unique values in each column of migrated_tuples
        unique_values = set(selg) | set(g)
        # Find the affected rules
        affected_rules = []
        for index, r in self.rule_care.iterrows():
            if any(value in unique_values for value in r['antecedents']) or any(value in unique_values for value in r['consequents']):
                affected_rules.append(index)
                break

        # for rule, budget in self.budgets.items():
        #     antecedents, consequents = rule
        #     for unique_value in unique_values:
        #         if any(value in unique_value for value in antecedents) or any(value in unique_value for value in consequents):
        #             affected_rules.append(rule)
        #             break

        return affected_rules

    def calculate_budgets(self):
        # self.budgets = {}
        # for index, r in self.rule_care.iterrows():
        #     # rule = (tuple([tuple(r['antecedents']), tuple(r['consequents'])]))
        #     if r['qi_rhs']:
        #         self.budgets[index] = min(
        #             (float(r['support'])-self.min_sup), float(r['support'])*(float(r['confidence'])-self.min_conf)/float(r['confidence']))
        #     else:
        #         self.budgets[index] = min(
        #             (float(r['support'])-self.min_sup), float(r['support'])*(float(r['confidence'])-self.min_conf)/(float(r['confidence'])*(1-self.min_conf)))
        self.rule_care['budget'] = self.rule_care.apply(lambda r: min((float(r['support'])-self.min_sup),
                                                                      float(
                                                                          r['support'])*(float(r['confidence'])-self.min_conf)/float(r['confidence'])
                                                                      if r['qi_rhs'] else
                                                                      (float(
                                                                          r['support'])-self.min_sup),
                                                                      float(r['support'])*(float(r['confidence'])-self.min_conf)/(float(r['confidence'])*(1-self.min_conf))), axis=1)

        assert (self.rule_care['budget'] > 0).all()

    def generate_rules(self):
        self.frequent_itemsets = apriori(
            self.df, min_support=self.min_sup, use_colnames=True)
        rules = association_rules(
            self.frequent_itemsets, metric="confidence", min_threshold=self.min_conf)

        qi_rules = rules[rules['antecedents'].apply(lambda x: any(qi in item for item in x for qi in self.quasi_identifiers)) |
                         rules['consequents'].apply(lambda x: any(qi in item for item in x for qi in self.quasi_identifiers))]

        qi_rules['qi_rhs'] = qi_rules['consequents'].apply(
            lambda x: any(qi in item for item in x for qi in self.quasi_identifiers))
        qi_rules['antecedents'] = qi_rules['antecedents'].apply(
            lambda x: frozenset([val.split(":")[1] for val in x]))
        qi_rules['consequents'] = qi_rules['consequents'].apply(
            lambda x: frozenset([val.split(":")[1] for val in x]))

        self.rule_care = qi_rules[[
            'antecedents', 'consequents', 'support', 'confidence', 'qi_rhs']]
