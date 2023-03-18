from anonymizer.anonymize import Anonymizer


def anonymize(args):
    print(type(args))
    print(args)
    anonymizer = Anonymizer(args)
    anonymizer.anonymize()
    anonymizer.output(f'results/new_data.csv')
