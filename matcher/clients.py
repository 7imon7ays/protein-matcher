import io
import os
import xml.etree.ElementTree as ET
from time import sleep

from Bio.Blast.NCBIWWW import qblast
from django.conf import settings


def _mock_qblast(program, db, dna_sequence, entrez_query):

  info_string = """Running mock qblast.
Program: {0}
Database: {0}
DNA sequence: {0}
Entrez query: {0}
"""
  print(info_string.format(program, db, dna_sequence, entrez_query))

  mock_file_path = os.path.join(settings.BASE_DIR, 'matcher', 'mocks', 'qblast_response.xml')
  with open(mock_file_path, 'r') as mock_file:
    mock_response = mock_file.read()

  sleep(5)
  return io.StringIO(mock_response)


class EntrezClient:
  def __init__(self):
    if settings.BLAST['mock_backend']:
      self._qblast = _mock_qblast
    else:
      self._qblast = qblast

    self._program = settings.BLAST['program']
    self._db = settings.BLAST['database']
    self._protein_accession_strings_to_ids = settings.PROTEIN_ACCESSION_STRINGS_TO_IDS

  def blast(self, dna_sequence):
    qblast_response = self._qblast(
            self._program,
            self._db,
            dna_sequence,
            entrez_query=self._build_entrez_query()
        )

    protein_id, accession_string = self.parse_blast_result(qblast_response)
    print(
      'Matched DNA sequence "%s" to protein ID "%s" via accession string "%s".' % (
        dna_sequence, protein_id, accession_string,
      )
    )
    return protein_id, accession_string

  def parse_blast_result(self, qblast_response):
    blast_result_xml = ET.fromstring(qblast_response.read())
    for hit_accession in blast_result_xml.iter(tag='Hit_accession'):
      accession_string = hit_accession.text

      print('Matched DNA sequence to accession string "%s".' % accession_string)

      if accession_string in self._protein_accession_strings_to_ids:
        protein_id = self._protein_accession_strings_to_ids[accession_string]
        # Ignore subsequent matches.
        return protein_id, accession_string

  def _build_entrez_query(self):
    return ' OR '.join([
      protein_id + '[accession]'
        for protein_id in self._protein_accession_strings_to_ids.keys()
      ])