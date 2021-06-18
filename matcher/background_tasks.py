from background_task import background

from matcher.clients import EntrezClient
from matcher.models import Search


@background(schedule=0)
def match_to_protein(search_id):
    search_instance = Search.objects.get(pk=search_id)

    # TODO: Add method on search to print first ten chars of DNA sequqnce.
    print(
        'Starting search #%s for a protein that matches DNA sequence "%s".' % (
            search_instance.id, search_instance.abbreviated_dna_sequence,
        )
    )
    search_instance.mark_run()
    entrez_client = EntrezClient()

    try:
        protein_id, accession_string = entrez_client.blast(
            search_instance.dna_sequence
        )
    except:
        search_instance.mark_pause()
        raise

    search_instance.protein_id = protein_id
    search_instance.accession_string = accession_string
    search_instance.mark_done()
