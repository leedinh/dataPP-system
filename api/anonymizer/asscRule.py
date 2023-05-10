import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules, fpgrowth
from mlxtend.preprocessing import TransactionEncoder


class Rule:
    def __init__(self, df: pd.DataFrame, quasi_identifiers, min_support: float, min_confidence: float):
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
        return str(column_name) + '::' + str(value)

    def get_affected_rules(self, selg, qsi):
        # Create a set of unique value strings for each column of migrated_tuples
        unique_values = set()
        for s, qsi_val in zip(selg, qsi):
            unique_values.add(f"{qsi_val}::{s}")

        # Find the affected rules
        affected_rules = []
        for index, row in self.rule_care.iterrows():
            rule = row['antecedents'].union(row['consequents'])

            for value in unique_values:
                if str(value) in rule:
                    affected_rules.append(index)
                    break

        return affected_rules

    def calculate_budgets(self):
        self.rule_care['budget'] = self.rule_care.apply(lambda r: min((float(r['support'])-self.min_sup),
                                                                      float(
                                                                          r['support'])*(float(r['confidence'])-self.min_conf)/float(r['confidence'])
                                                                      if r['qi_rhs'] else
                                                                      (float(
                                                                          r['support'])-self.min_sup),
                                                                      float(r['support'])*(float(r['confidence'])-self.min_conf)/(float(r['confidence'])*(1-self.min_conf))), axis=1)
        self.rule_care = self.rule_care[self.rule_care['budget']
                                        > 1e-03].reset_index(drop=True)
        assert (self.rule_care['budget'] > 1e-03).all()

    def generate_rules(self):
        self.frequent_itemsets = apriori(
            self.df, min_support=self.min_sup, use_colnames=True)
        rules = association_rules(
            self.frequent_itemsets, metric="confidence", min_threshold=self.min_conf)

        qi_rules = rules[rules['antecedents'].apply(lambda x: any(qi in item for item in x for qi in self.quasi_identifiers)) |
                         rules['consequents'].apply(lambda x: any(qi in item for item in x for qi in self.quasi_identifiers))]

        qi_rules['qi_rhs'] = qi_rules['consequents'].apply(
            lambda x: any(qi in item for item in x for qi in self.quasi_identifiers))

        self.rule_care = qi_rules[[
            'antecedents', 'consequents', 'support', 'confidence', 'qi_rhs']]
        print('Finalized rule set number: ', self.rule_care.size)
