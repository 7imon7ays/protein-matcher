from background_task import background

from matcher.clients import EntrezClient
from matcher.models import Search


@background(schedule=0)
def match_to_protein(search_id):
    search_instance = Search.objects.get(pk=search_id)

    # TODO: Add method on search to print first ten chars of DNA sequqnce.
    print('Starting search #%s for a protein that matches DNA sequence "%s".' % (
            search_instance.id, search_instance.dna_sequence,
    ))
    search_instance.mark_running()
    entrez_client = EntrezClient()

    try:
        protein_id, accession_string = entrez_client.blast(
            search_instance.dna_sequence
        )
    except:
        # TODO: Make it easier to tell if the job has retries left.
        search_instance.mark_error()
        raise

    if protein_id == '':
        print('Search #%s did not match DNA sequence "%s" to a known protein ID.' % (
            search_instance.id, search_instance.dna_sequence,
        ))
        search_instance.mark_not_found()
        return

    search_instance.protein_id = protein_id
    search_instance.accession_string = accession_string
    search_instance.mark_found()
    print('Completed search with attributes %s.' % str(search_instance.as_dict()))
