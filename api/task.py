from anonymizer.anonymize import Anonymizer


def anonymize(args):
    anonymizer = Anonymizer(args)
    anonymizer.anonymize()
    anonymizer.output(args['output'])
