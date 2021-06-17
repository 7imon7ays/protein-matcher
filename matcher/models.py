import xml.etree.ElementTree as ET

from Bio.Blast.NCBIWWW import qblast
from django.db import models


class Protein(models.Model):
  accn_strings_to_ids = {
    'JF411744': 'NC_000852',
    'AJ890364': 'NC_007346',
    'EF101928': 'NC_008724',
    'DQ491003': 'NC_009899',
    'GU244497': 'NC_014637',
    'JX962719': 'NC_020104',
    'KF740664': 'NC_023423',
    'JN258408': 'NC_023640',
    'JN638751': 'NC_023719',
    'KR921745': 'NC_027867',
}

  @classmethod
  def find_by_dna_sequence(cls, dna_sequence):
    qblast_response = qblast('blastn', 'nr', dna_sequence, entrez_query=cls._build_entrez_query())
    blast_result_xml = ET.fromstring(qblast_response.read())
    for hit_accession in blast_result_xml.iter(tag='Hit_accession'):
      print('Matched DNA sequence to accession string "%s".' % hit_accession.text)
      if hit_accession.text in cls.protein_accn_strings_to_ids:
        # TODO: Return a proper protein object?
        print('Mapping this string to "%s."' % cls.protein_accn_strings_to_ids[hit_accession.text])
        return cls.protein_accn_strings_to_ids[hit_accession.text]

  @classmethod
  def _build_entrez_query(cls):
    return ' OR '.join([protein_id + '[accession]' for protein_id in cls.accn_strings_to_ids.keys()])
