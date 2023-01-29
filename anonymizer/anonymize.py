import numpy as np
import pandas as pd
import os

class Anonymizer:
    def __init__(self, args):
        self.k = args.k
        self.dataset = args.dataset
        self.conf = args.conf
        self.sup = args.sup
        res_folder = os.path.join('results', args.dataset)
        self.anon_folder = res_folder
        self.qsi = args.qsi
        os.makedirs(self.anon_folder, exist_ok=True)
        print(self.k, self.dataset, self.conf, self.sup, self.anon_folder, self.qsi)
    
    
    def _budgets(self):
        pass    

    
    def _clean(self, dataset):
        dataset.dropna(inplace=True, axis=0)
        for lab, row in dataset.iterrows():
            for cell in row:
                if cell == '?':
                    dataset.drop(lab, inplace=True)
                    break
        return dataset
    
    def get_qsi_list(self):
        if self.qsi is None:
            raise Exception("You must provide a QSI list")
        columns = list(self.ds.columns)
        return [columns[i] for i in self.qsi]
    
    def rules(self):
        rules = pd.read_csv(r"rules.csv")
        print(rules.head())
        r = [[list(eval(rules['antecedents'].iloc[i])), list(eval(rules['consequents'].iloc[i])), rules['support'].iloc[i], rules['confidence'].iloc[i]] for i in range(len(rules))]
        print(r)
    
    def anonymize(self):
        self.ds = pd.read_csv(self.dataset)
        # self.ds = self._clean(self.ds)
        qsi_name = self.get_qsi_list()
        self.rules()
        
        
    def test(self):
        print("Hello, world")    