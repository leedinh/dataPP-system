import argparse
from anonymize import Anonymizer

parser = argparse.ArgumentParser('main.py')
parser.add_argument('--k', type=int, default=5,
                    help="K-Anonymity or L-Diversity")
parser.add_argument('--dataset', type=str, default='input.csv',
                    help="Dataset to anonymize")
parser.add_argument('--conf', type=float, default=0.5,
                    help="Confidence value")
parser.add_argument('--sup', type=float, default=0.5,
                    help="Support value")
parser.add_argument('--qsi', nargs="+", type=int,  help="List of index of columns are quasi-Identifier")
parser.add_argument('--rule', type=str, default='adult',
                    help="Dataset to anonymize")


if __name__ == '__main__':
    args = parser.parse_args()
    anonymizer = Anonymizer(args)
    anonymizer.anonymize()