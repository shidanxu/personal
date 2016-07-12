# Lead author: Neil Gurram
# Learned about this from reading webcrawling information on websites.

#! C:\python27

import re, urllib
from urllib import urlopen
import nltk
import html2text
from bs4 import BeautifulSoup
import csv

##list_of_links = set()
##textfile = file('websites.txt','wt')
##baseString = "http://www.mfa.org/collections/search?search_api_views_fulltext=&page="
##endString = "&sort=search_api_relevance&order=desc&f[0]=field_onview%3A1"
##print "Iterating through all webpages"
##for i in range(939):
##    myurl = baseString+str(i)+endString
##    for j in re.findall('''href=["'](.[^"']+)["']''', urllib.urlopen(myurl).read(), re.I):
##        if ("object" in j):
##            if j not in list_of_links:
##                list_of_links.add(j)
##                textfile.write(j+'\n')
##    if i%5 == 0:
##        print i
##textfile.close()
##print "Finished compiling links"

print "Starting to Compile for CSV"
entriesForCSV = [['action', 'access number', 'name', 'location', 'on view status']]
def writeToCSV(numEntries):
    counter = 0
    with open('websites.txt', 'r') as f:
        for line in f:
            if counter == numEntries:
                break
            if counter%10 == 0:
                print counter
            counter += 1
            urlString = line[:-1]
            html = urlopen(urlString).read()
            soup = BeautifulSoup(html)
            text = soup.get_text().strip()
            barIndex = text.index('|')
            accessIndex = text.index('Accession Number')
            lengthAccess = len('Accession Number')
            mediumIndex = text.index('Medium or Technique')
            onViewIndex = text.index('On View')
            lengthOnView = len('On View')
            collectionsIndex = text.index('Collections', onViewIndex)
            title = text[:barIndex]
            accessNumber = text[accessIndex+lengthAccess+1:mediumIndex].strip()
            gallery = text[onViewIndex+lengthOnView+1:collectionsIndex].\
                      strip().split()[-1][:-1]
            entriesForCSV.append(['add', accessNumber, title, gallery, True])
    with open('artworkInfo.csv', 'wb') as f:
        writer = csv.writer(f)
        writer.writerows(entriesForCSV)
writeToCSV(100)
##        for ee in re.findall('''href=["'](.[^"']+)["']''', urllib.urlopen(i).read(), re.I):
##                print ee
##                textfile.write(ee+'\n')
##textfile.close()
