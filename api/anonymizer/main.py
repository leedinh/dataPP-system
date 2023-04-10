from anonymize import Anonymizer
import time

if __name__ == '__main__':
    input = r'/Users/dinh.le/School/dataPP-system/api/anonymizer/adult.csv'

    data = {'k': 0, 'conf': 0.9, 'sup': 0.7,
            'qsi': [0, 1, 3, 5], 'input': input}

    with open(r'output_adult.txt', 'w') as f:
        for i in range(5, 30):
            start_time = time.time()
            data['k'] = i
            anonymizer = Anonymizer(data)
            anonymizer.anonymize()
            anonymizer.output(f'results_adult/out_{i}.csv')
            end_time = time.time()
            time_elapsed = end_time - start_time
            f.write(f"Time elapsed of {i}: {time_elapsed}\n")
