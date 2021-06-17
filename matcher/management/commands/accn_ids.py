import json

from Bio import Entrez
from django.core.management import BaseCommand

from matcher.models import Protein

class Command(BaseCommand):
  help = 'For every protein ID we want to search against,\
    query the NCBI database for its corresponding accession string.'

  def handle(self, *args, **options):
    protein_ids = Protein.accn_strings_to_ids.values()

    # TODO: replace with API key stored as environment variable.
    Entrez.email = 'ncbi@junkinbo.xyz'

    searchHandle = Entrez.esearch(db='nucleotide', term='OR '.join([
        protein_id + '[accession]' for protein_id in protein_ids
    ]))

    ids = Entrez.read(searchHandle)['IdList']

    summary_response = Entrez.esummary(db='nucleotide', id=','.join(ids), retmode='json')
    summary_dict = json.loads(summary_response.read().decode('UTF-8').strip())

    for result_key in summary_dict['result']:
        if result_key == 'uids':
            continue

        hit = summary_dict['result'][result_key]
        print(hit['assemblyacc'], '=>', hit['caption'])