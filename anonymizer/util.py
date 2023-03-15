import pandas as pd

# Load the dataset
df = pd.read_csv('input.csv')

# Define the quasi-identifiers
qi_attributes = ["age", "gender", "education", "marital-status"]

# Group the individuals based on the QI attributes
groups = df.groupby(qi_attributes)
for group in groups:
    print(group[0], len(group[1]))

# Calculate the size of each group
group_sizes = groups.size()

# Print the number of groups and the size of each group
print('Number of groups:', len(group_sizes))
print('Group sizes:')
print(group_sizes)
