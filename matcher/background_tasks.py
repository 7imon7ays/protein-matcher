from background_task import background

@background(schedule=5)
def find_matching_protein(dna_sequence, query_id):
    print('Found DNA sequence:')
    print(dna_sequence, query_id)
