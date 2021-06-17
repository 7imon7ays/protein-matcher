from background_task import background

from matcher.models import Protein

@background(schedule=5)
def find_matching_protein(dna_sequence, query_id):
    protein_id = Protein.find_by_dna_sequence(dna_sequence)
    print('Matched DNA sequence "%s" to protein ID "%s".' % dna_sequence, protein_id)
