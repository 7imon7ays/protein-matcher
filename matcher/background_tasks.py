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
        protein_id, accession_string = entrez_client.blast(
            search_instance.dna_sequence
        )
    # Record in the searches table that this search encountered an error.
    except:  # noqa TODO: Find out what errors exactly the API call can throw.
        # TODO: Make it easier to tell if the job has retries left.
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
    search_instance.mark_found()
    print(
        'Completed search with attributes %s.' % str(search_instance.as_dict())
    )
