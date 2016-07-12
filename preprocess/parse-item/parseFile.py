# Lead author: Neil Gurram

import re, urllib
from urllib import urlopen
import nltk
import html2text
from bs4 import BeautifulSoup

urlString = "http://www.mfa.org/collections/object/drinking-cup-kylix-118"
html = urlopen(urlString).read()
soup = BeautifulSoup(html)

text = soup.get_text().strip()
barIndex = text.index('|')
##print barIndex
##print text[0:barIndex]
##accessIndex = text.index('Accession Number')
##mediumIndex = text.index('Medium or Technique')
##print text[accessIndex+len('Accession Number')+1:mediumIndex].strip()
onViewIndex = text.index('On View')
collectionsIndex = text.index('Collections', onViewIndex)
print text[onViewIndex+len('On View')+1: collectionsIndex].strip().split()[-1][:-1]
##components = text.split()
##print len(text)

##print text
