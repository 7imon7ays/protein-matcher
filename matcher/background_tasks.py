from background_task import background

from matcher.clients import EntrezClient
from matcher.models import Search


@background(schedule=0)
def match_to_protein(search_id):
    """Execute calls to NCBI servers without blocking the client."""
    search_instance = Search.objects.get(pk=search_id)

    # TODO: Add method on search to print first ten chars of DNA sequqnce.
    print('Starting search #%s for a protein that matches DNA sequence "%s".' % (  # noqa
            search_instance.id, search_instance.dna_sequence,
    ))
    search_instance.mark_running()
    entrez_client = EntrezClient()

    try:
        protein_id, accession_string, match_from, match_to =\
            entrez_client.blast(search_instance.dna_sequence)
    # Record in the searches table that this search encountered an error.
    except Exception as exception:  # noqa TODO: Find out what errors exactly the API call can throw.
        if 'Query contains no sequence data' in str(exception):
            print('Entrez reports no sequence data in "%s".' % search_instance.dna_sequence)
            print('Marking search as not found.')
            search_instance.mark_not_found()
            return
        # TODO: Make it easier to tell if the job has no more retries left.
        search_instance.mark_error()
        raise

    if protein_id == '':
        print('Search #%s did not match DNA sequence "%s" to a known protein ID.' % (  # noqa
            search_instance.id, search_instance.dna_sequence,
        ))
        search_instance.mark_not_found()
        return

    search_instance.protein_id = protein_id
    search_instance.accession_string = accession_string
    search_instance.match_from = match_from
    search_instance.match_to = match_to
    search_instance.mark_found()
    print(
        'Completed search with attributes %s.' % str(search_instance.as_dict())
    )
