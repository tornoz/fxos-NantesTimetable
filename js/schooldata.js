var schooldata = '{ \
      "univ-nantes" : {  \
        "baseurl" : "https://edt.univ-nantes.fr", \
        "schools" : [ \
            { "name" : "Polytech", \
             "url" : "chantrerie-gavy",\
             "auth" : true},\
            { "name" : "IEMN-IAE",\
             "url" : "iemn_iae",\
             "auth" : false},\
            { "name" : "Droit et sciences politiques",\
             "baseurl" : "http://www.droit.univ-nantes.fr",\
             "url" : "ept",\
             "auth" : false},\
            { "name" : "Iquabian",\
             "url" : "iquabian",\
             "auth" : false},\
            { "name" : "Médecine, Pharmacie",\
             "url" : "medecine",\
             "auth" : false},\
            { "name" : "Odontologie",\
             "url" : "odontologie",\
             "auth" : false},\
            { "name" : "Sciences et Techniques",\
             "url" : "sciences",\
             "auth" : true},\
            { "name" : "STAPS",\
             "url" : "staps",\
             "auth" : false},\
            { "name" : "IUFM Angers",\
             "url" : "iufm-angers",\
             "auth" : true},\
            { "name" : "IUFM Le Mans",\
             "url" : "iufm-mans",\
             "auth" : false},\
            { "name" : "IUFM Nantes",\
             "url" : "iufm-nantes",\
             "auth" : true},\
            { "name" : "IUFM La Roche Sur Yon",\
             "url" : "iufm-roche",\
             "auth" : true},\
            { "name" : "IUT Saint-Nazaire",\
             "url" : "iut_st_naz",\
             "auth" : false},\
            { "name" : "IUT Nantes",\
             "url" : "iut_nantes",\
             "auth" : false},\
            { "name" : "Langues - CIL (Nantes)",\
             "url" : "langues",\
             "auth" : false},\
            { "name" : "IRFFLE",\
             "url" : "itflle",\
             "auth" : false},\
            { "name" : "Histoire",\
             "url" : "histoire",\
             "auth" : false},\
            { "name" : "IGARUN",\
             "url" : "igarun",\
             "auth" : false},\
            { "name" : "Psychologie",\
             "url" : "psycho",\
             "auth" : false},\
            { "name" : "Lettres et langages",\
             "url" : "lettreslangages",\
                 "auth" : false}\
        ]\
        }\
}';

function loadSchoolData() {
    return JSON.parse(schooldata);
}
            