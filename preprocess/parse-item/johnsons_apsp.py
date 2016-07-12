""" Johnson's algorithm for all-pairs shortest path problem.
Reimplemented Bellman-Ford and Dijkstra's for clarity"""

''' Code partially courtesy to prakhar1989 on Github'''

from heapq import heappush, heappop
from datetime import datetime
from copy import deepcopy
import os
import csv
import json
import itertools

graph = { 
    'a' : {'b':-2},
    'b' : {'c':-1},
    'c' : {'x':2, 'a':4, 'y':-3},
    'z' : {'x':1, 'y':-4},
    'x' : {},
    'y' : {},
}

inf = float('inf')
dist = {}

def read_graph(file,n):
    graph = dict()
    positions = dict()
    with open(file, 'rU') as f:
        linereader = csv.reader(f, delimiter=' ', quotechar='|')
        for row in linereader:
            l = ', '.join(row)
            (objectType, floor, u, v, w) = l.split(",")
            if objectType == '0':
                # It's a gallery
                graph[int(u)] = dict()
                # floor, x, y
                positions[int(u)] = [int(v), int(w)]
            elif objectType == '1':
                # It's an edge
                if int(u) not in graph:
                    graph[int(u)] = dict()
                graph[int(u)][int(v)] = int(w)
                graph[int(v)][int(u)] = int(w)
            
    '''             
    for i in range(n):
        if i not in graph:
            graph[i] = dict()
    '''
    return graph, positions

def dijkstra(graph, s):
    n = len(graph.keys())
    dist = dict()
    previous = {}
    Q = list()
    
    for v in graph:
        dist[v] = inf
        previous[v] = None
    dist[s] = 0
    previous[s] = None

    heappush(Q, (dist[s], s))

    while Q:
        d, u = heappop(Q)
        if d < dist[u]:
            dist[u] = d
        for v in graph[u]:
            if dist[v] > dist[u] + graph[u][v]:
                dist[v] = dist[u] + graph[u][v]
                # also modify parent node
                previous[v] = u
                heappush(Q, (dist[v], v))
    return dist, previous

def initialize_single_source(graph, s):
    for v in graph:
        dist[v] = inf
    dist[s] = 0
    
def relax(graph, u, v):
    if dist[v] > dist[u] + graph[u][v]:
        dist[v] = dist[u] + graph[u][v]

def bellman_ford(graph, s):
    initialize_single_source(graph, s)
    edges = [(u, v) for u in graph for v in graph[u].keys()]
    number_vertices = len(graph)
    for i in range(number_vertices-1):
        for (u, v) in edges:
            relax(graph, u, v)
    for (u, v) in edges:
        if dist[v] > dist[u] + graph[u][v]:
            return False # there exists a negative cycle
    return True

def add_extra_node(graph):
    graph[0] = dict()
    for v in graph.keys():
        if v != 0:
            graph[0][v] = 0

def reweighting(graph_new):
    add_extra_node(graph_new)
    if not bellman_ford(graph_new, 0):
        # graph contains negative cycles
        return False
    for u in graph_new:
        for v in graph_new[u]:
            if u != 0:
                graph_new[u][v] += dist[u] - dist[v]
    del graph_new[0]
    return graph_new

def johnsons(graph_new):
    graph = reweighting(graph_new)
    if not graph:
        return False
    final_distances = {}
    allpaths = {}
    for u in graph:
        final_distances[u], allpaths[u] = dijkstra(graph, u)

    for u in final_distances:
        for v in final_distances[u]:
            final_distances[u][v] += dist[v] - dist[u]
    return final_distances, allpaths
            
def compute_min(final_distances):
    return min(final_distances[u][v] for u in final_distances for v in final_distances[u])

'''
Turn everything into node1, node2, path
'''
def process_paths(allpaths):
    n = len(graph.keys())
    list_paths = []
    for start in allpaths:
        for dest in allpaths[start]:
            if start <= dest:
                mypath = find_path(allpaths, start, dest)
                mypath = mypath.replace(",", "_")
                mypath = mypath.replace('[', "")
                mypath = mypath.replace(']', "")

                newstring = "add," + str(start)+"_"+str(dest) +",,"+str(mypath)
                list_paths.append(newstring)

    return list_paths

def find_path(allpaths, start, dest):
    n = len(graph.keys())
    mypath = str(start)
    
    if allpaths[start][dest] == None:
        return mypath
    elif allpaths[start][dest] == start:
        mypath+=","+str(dest)
        return mypath
    else:
        mypath+=","+(find_path(allpaths, allpaths[start][dest], dest))
        return mypath

if __name__ == "__main__":
    # graph_new = deepcopy(graph)
    __location__ = os.getcwd()
    mypath = os.path.join(__location__, '../../public/csv/map.csv')

    graph_new, positions = read_graph(mypath, 1000)
    
    #print graph_new, positions
    
    t1 = datetime.utcnow()
    final_distances, allpaths =  johnsons(graph_new)
    print "Distances"
    print final_distances
    print "Path by previous nodes, none means self, same means directly connected:"
    print allpaths
    
    if not final_distances:
        print "Negative cycle"
    else:
        print compute_min(final_distances)
    print datetime.utcnow() - t1

    APSP = process_paths(allpaths)

    f = open('APSPprocessed.csv','w')

    f.write("name,path\n")
    for string in APSP:
        f.write(string.strip() + "\n")
    f.close()
