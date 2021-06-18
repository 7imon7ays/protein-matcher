import xml.etree.ElementTree as ET

from Bio.Blast.NCBIWWW import qblast
from background_task import background

from matcher.models import Search


@background(schedule=0)
def match_to_protein(search_id):
    search_instance = Search.objects.get(pk=search_id)

    # TODO: Add method on search to print first ten chars of DNA sequqnce.
    print(
        'Starting search #%s for a protein that matches DNA sequence "%s".' % (
            search_instance.id, search_instance.dna_sequence[:10],
        )
    )
    search_instance.mark_run()

    # TODO: Add environment variable to mock out Blast client.
    try:
        qblast_response = qblast(
            'blastn', 'nr', search_instance.dna_sequence, entrez_query=_build_entrez_query(search_instance.protein_accn_strings_to_ids)
        )
        blast_result_xml = ET.fromstring(qblast_response.read())
        _register_blast_result(search_instance, blast_result_xml)
    except:
        search_instance.mark_pause()
        raise

    search_instance.mark_done()


def _register_blast_result(search_instance, blast_result_xml):
    for hit_accession in blast_result_xml.iter(tag='Hit_accession'):
      accession_string = hit_accession.text

      print('Matched DNA sequence to accession string "%s".' % accession_string)

      if accession_string in search_instance.protein_accn_strings_to_ids:
        protein_id = search_instance.protein_accn_strings_to_ids[accession_string]

        print(
            'Matched DNA sequence "%s" to protein ID "%s" via accession string "%s".' % (
                search_instance.dna_sequence[:10], protein_id, accession_string,
            )
        )

        search_instance.protein_id = protein_id
        search_instance.accession_string = accession_string

        # Ignore subsequent matches.
        return

def _build_entrez_query(accn_strings_to_ids):
    return ' OR '.join([protein_id + '[accession]' for protein_id in accn_strings_to_ids.keys()])