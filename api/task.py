# from anonymizer.anonymize import Anonymizer
# from model import Dataset


# def anonymize(args, did, app):
#     with app.app_context():
#         ds = Dataset.find_by_did(did)
#         ds.update_status('anonymizing')
#         anonymizer = Anonymizer(args)
#         anonymizer.anonymize()
#         anonymizer.output(args['output'])
#         ds.update_status('completed')
