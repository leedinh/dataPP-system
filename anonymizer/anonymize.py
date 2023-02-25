import numpy as np
import pandas as pd
import os
import math
import collections
import random

class Anonymizer:
    def __init__(self, args):
        self.k = args.k                                                         # k value of k-anoynimity
        self.dataset = args.dataset                                             # file name of the dataset
        self.conf = args.conf                                                   # confidence value from user input
        self.sup = args.sup                                                     # support value from user input
        self.qsi = args.qsi 
        
        
        self.anon_folder =  os.path.join('results', "test")               # init the result folder
        os.makedirs(self.anon_folder, exist_ok=True)
        
        self.ds = pd.read_csv(self.dataset)
        
        # get list of column indexes as qsi-identifier
        if self.qsi is None:
            raise Exception("You must provide a QSI list")
        columns = list(self.ds.columns)
        self.quasiID = [columns[i] for i in self.qsi]
        
    
    def _budgets(self):
        self._budgets = {}
        for r in self.rule_care:
            rule = (tuple([tuple(r[0]),tuple(r[1])]))
            if r[4]:
                self._budgets[rule]= min((r[2]-self.sup), r[2]*(r[3]-self.conf)/r[3])
            else:
                self._budgets[rule]= min((r[2]-self.sup), r[2]*(r[3]-self.conf)/(r[3]*(1-self.conf)))
            assert(self._budgets[rule] > 0)
            
        assert(len(self._budgets) == len(self.rule_care))
            
            
    def _clean(self, dataset):
        dataset.dropna(inplace=True, axis=0)
        for lab, row in dataset.iterrows():
            for cell in row:
                if cell == '?':
                    dataset.drop(lab, inplace=True)
                    break
        return dataset
    

    # Read rules from the rule set file
    # Rules template: [LHS, RHS, sup, conf]
    #       + LHS = RHS = [column_name:value]
    # We need to extract the rule_care from the rule set
    def setup_rule_care(self, path_rule):
        rules = pd.read_csv(path_rule)
        rs = [[list(eval(rules['antecedents'].iloc[i])), list(eval(rules['consequents'].iloc[i])), rules['support'].iloc[i], rules['confidence'].iloc[i]] for i in range(len(rules))]
        self.rule_care = []
        for r in rs:
            has_qsi = False
            rhs = False
            for i in r[0]:
                if i.split(':')[0] in self.quasiID:
                    has_qsi = True
                    break
            
            for i in r[1]:
                if i.split(':')[0] in self.quasiID:
                    has_qsi = True
                    rhs = True
                    break
            if has_qsi:
                self.rule_care.append(r + [rhs])
                
    
    def prepare_input(self, input):
        for i in range(len(input)):
            for j in input.columns:
                input[j].iloc[i] = j + ":" + str(input[j].iloc[i])
        subset = input[self.quasiID]
        tuples = [tuple(x) for x in subset.to_numpy()]
        assert( len(tuples) == len(self.ds))
        freq= dict(collections.Counter(tuples)) #GROUPING EACH ROW WITH ITS KEY AS TUPLE OF QSI VALUE
                
        index_map = {}
        for index, row in input[self.quasiID].iterrows():
            t = tuple(row)
            if t in index_map:
                index_map[t].append(index)
            else:
                index_map[t] = [index]
        
        return freq, index_map
    
    
    ## Utility functions
    def is_safe(self,g):
        return self.freq[g]>=self.k or self.freq[g] == 0    
    
    def risk(m,k):
        # if m == 0:
        #     return 0
        if m >=k:
            return 0
        else:
            return 2*k - m
        
    def count_Rt(rules, t):
        res = []
        for  r in rules:
            check = True
            for i in r[0]+r[1]:
                if i not in t:
                    check = False
                    break
            if check:
                res.append(r)
        return res
    
       
    def check_budget(self, gi, gj):
        qij = [gi[k] for k in range(len(gi)) if gj[k]!=gi[k]]
        rij= self.count_Rt(self.rule_care, qij)
        for r in rij:
                tr = tuple(r[0]+r[1])
                if (self._budgets[tr] <=0):
                    return False
        return True
    ## End of utility function    
    
    def check_flow(i, j):
        if i == -1 and j == 1:
            return True
        if i == -1 and j == 0:
            return True
        if i == 0 and j == 1:
            return True
        if i == 0 and j == 0:
            return True
        return False
        
    def initial_state(self):
        sg = []
        ug = []
        ug_small = []
        ug_big = []
        um = []

        #STATE OF EACH GROUP CAN GIVE OR BE GIVEN
        state = self.freq.copy()
        for i in state:
            state[i]=0

        for i in self.freq:
            if self.freq[i] >= self.k:
                sg.append(i)
            else:
                ug.append(i)
                if self.freq[i] <= self.k/2:
                    ug_small.append(i)
                else:
                    ug_big.append(i)

        ug = sorted(ug, key=lambda x: self.freq[x])
        # print(self.k)
        # [print(i, self.freq[i]) for i in ug]
                
        
        
    def find_group_to_migrate(self, selg, rmg):
        # target = None
    # state = 0
    #POLICY
    #1. Nếu 1 group cho tuple thì nó sẽ luôn luôn luôn cho, và ngược lại nhận thì sẽ luôn luôn nhận
    #2. gi -> gj (Vr thuoc Ri,gi->gj, Budget_r > 0)
    #3. Give 2 group gi, gj. Assume gi is k-unsafe group(freq[gi] < k). The number of migrant tuples (mgrtN) is determined:
    #    Case 1: gj is k-unsafe group(freq[gj] < k). If gi->gj, then mgrtN = min(|gi|, k - |gj|). If gi <- gj then mgrtN = min(|gj|, k - |gi|)
    #    Case 2: gj is k-safe group(freq[gj] >= k). If gi->gj, then mgrtN = |gi|. If gi <- gj then mgrtN <= Min(k - |gi|, |gj|-k, |origin(gj)|), 
    #       when min(|origin(gj)|, |gj|-k) = 0 then gi <= gj is impossible.
    
        candidates = None
        max_reduction = -100
        for g in rmg: # UGB + USG + SG -> rate risk_after = 0
            init_risk = self.risk(self.freq[selg],self.k) + self.risk(self.freq[g],self.k)
            
            if not (self.check_flow(self.state[selg], self.state[g]) or (self.check_flow(self.state[g], self.state[selg]))):
                continue
                
            if not self.is_safe(g): # g is k-unsafe group
                # selfg -> g    
                if self.check_flow(state[selg], state[g]):
                    #Check Budget selg -> g
                    if not self.check_budget(selg,g):
                        continue
                    
                    mgrntN1 = min(self.freq[selg], self.k - self.freq[g])
                    after_risk1 = self.risk(self.freq[selg] - mgrntN1,self.k) + self.risk(self.freq[g] + mgrntN1,self.k)
                    risk_reduce1 = init_risk - after_risk1
                    
                    if after_risk1 == 0:
                        return (g, mgrntN1, 1)
                    
                    if risk_reduce1 > max_reduction:
                        max_reduction = risk_reduce1
                        candidates = (g, mgrntN1, 1)
                
                        
                if self.check_flow(self.state[g], self.state[selg]):
                # selfg <- g 
                
                    #Check Budget g -> selfg
                    if not self.check_budget(g,selg):
                        continue

                    mgrntN2 = min(self.freq[selg], self.k - self.freq[g])
                    after_risk2 = self.risk(self.freq[selg] + mgrntN2,self.k) + self.risk(self.freq[g] - mgrntN2,self.k)
                    risk_reduce2 = init_risk - after_risk2
            
                    if after_risk2 == 0:
                        return (g, mgrntN2, -1)
                    
                    if risk_reduce2 > max_reduction:
                        max_reduction = risk_reduce2
                        candidates = (g, mgrntN2, -1)
            else:
                if self.check_flow(self.state[g], self.state[selg]):
                    #Check Budget g -> selfg
                    if not self.check_budget(g,selg):
                        continue
                    
                    if self.freq[g] == self.k: 
                        continue
                    mgrntN2 = min(self.k - self.freq[selg], self.freq[g]-self.k)
                    after_risk2 = self.risk(self.freq[selg] + mgrntN2, self.k) + self.risk(self.freq[g] - mgrntN2, self.k)
                    risk_reduce2 = init_risk - after_risk2
            
                    if after_risk2 == 0:
                        return (g, mgrntN2, -1)
                    
                    if risk_reduce2 > max_reduction:
                        max_reduction = risk_reduce2
                        candidates = (g, mgrntN2, -1)
                        
                        
                if self.check_flow(self.state[selg], self.state[g]):
                    if not self.check_budget(selg,g):
                        continue

                    mgrntN1 = self.freq[selg]
                    after_risk1 = self.risk( self.freq[selg] - mgrntN1, self.k) + self.risk(self.freq[g] + mgrntN1, self.k)
                    risk_reduce1 = init_risk - after_risk1
                    
                    if after_risk1 == 0:
                        return (g, mgrntN1, 1)
                    
                    if risk_reduce1 > max_reduction:
                        max_reduction = risk_reduce1
                        candidates = (g, mgrntN1, 1)
                            
    
        return candidates
 
    def anonymize(self):
        # qsi_name = self.get_qsi_list()
        self.setup_rule_care(r"./rules.csv")
        print(self.rule_care)
        # self.freq, self.index_map = self.prepare_input(self.ds)
        # self.initial_state()
        
    def test(self):
        print("Hello, world")    