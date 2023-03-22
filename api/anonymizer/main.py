import argparse
from anonymize import Anonymizer

parser = argparse.ArgumentParser('main.py')
parser.add_argument('--k', type=int, default=5,
                    help="K-Anonymity or L-Diversity")
parser.add_argument('--dataset', type=str, default='/Users/dinh.le/School/dataPP-system/anonymizer/input.csv',
                    help="Dataset to anonymize")
parser.add_argument('--conf', type=float, default=0.5,
                    help="Confidence value")
parser.add_argument('--sup', type=float, default=0.5,
                    help="Support value")
parser.add_argument('--qsi', nargs="+", type=int, default=[1, 2, 3, 4],
                    help="List of index of columns are quasi-Identifier")
parser.add_argument('--rule', type=str, default='adult',
                    help="Dataset to anonymize")


if __name__ == '__main__':
    input = r'./adult.csv'
    output = r'results/output.csv'
    anonymizer = Anonymizer(input, 5, 0.5, 0.5, [1, 2, 3, 4], output)
    anonymizer.anonymize()
    anonymizer.output(f'results/new_data.csv')
