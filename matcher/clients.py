import io
import os
import xml.etree.ElementTree as ET
from time import sleep

from Bio.Blast.NCBIWWW import qblast
from django.conf import settings


def _mock_qblast(program, db, dna_sequence, entrez_query):
    """Mock out call to NCBI for development and testing."""
    info_string = """Running mock qblast.
Program: {0}
Database: {0}
DNA sequence: {0}
Entrez query: {0}
"""
    print(info_string.format(program, db, dna_sequence, entrez_query))

    if dna_sequence == settings.BLAST.get('mock_unmatchable_sequence'):
        file_name = 'qblast_response_empty.xml'
    else:
        file_name = 'qblast_response_found.xml'

    mock_file_path = os.path.join(
        settings.BASE_DIR, 'matcher', 'mocks', file_name
    )
    with open(mock_file_path, 'r') as mock_file:
        mock_response = mock_file.read()

    sleep(settings.BLAST.get('mock_sleep_time_seconds', 2))
    return io.StringIO(mock_response)


class EntrezClient:
    """Interface to NCBI databases."""
    def __init__(self):
        if settings.BLAST['mock_backend']:
            self._qblast = _mock_qblast
        else:
            self._qblast = qblast

        self._program = settings.BLAST['program']
        self._db = settings.BLAST['database']
        self._protein_accession_strings_to_ids =\
            settings.PROTEIN_ACCESSION_STRINGS_TO_IDS

    def blast(self, dna_sequence):
        """Call out to NCBI servers."""
        qblast_response = self._qblast(
            self._program,
            self._db,
            dna_sequence,
            entrez_query=self._build_entrez_query()
        )

        protein_id, accession_string = self._parse_blast_result(
            qblast_response
        )
        return protein_id, accession_string

    def _parse_blast_result(self, qblast_response):
        blast_result_xml = ET.fromstring(qblast_response.read())
        for hit_accession in blast_result_xml.iter(tag='Hit_accession'):
            accession_string = hit_accession.text

            if accession_string in self._protein_accession_strings_to_ids:
                protein_id =\
                    self._protein_accession_strings_to_ids[accession_string]
                # Ignore subsequent matches.
                return protein_id, accession_string

        return ('', '',)

    def _build_entrez_query(self):
        """
        Given ['NC_000852', 'NC_007346']
        Return 'NC_000852[accession] OR NC_007346[accession]'.
        """
        accession_strings = self._protein_accession_strings_to_ids.keys()
        labeled_search_filters = [
          protein_id + '[accession]' for protein_id in accession_strings
        ]
        return ' OR '.join(labeled_search_filters)
