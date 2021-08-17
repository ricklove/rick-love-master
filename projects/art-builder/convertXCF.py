#!/usr/bin/python

import os
import glob
import sys
import time
from gimpfu import *

i = 0


def save_layer(image, l, layersDir):
    global i
    print "Saving layer %s" % l.name

    outfile = layersDir + '/' + str(i) + '-' + l.name + '.png'

    print "Saving to %s" % outfile
    pdb.file_png_save(image, l, outfile, outfile, True,
                      9, True, True, True, True, True)
    print "Saved to %s" % outfile
    i = i + 1


# def save_layer_or_group(layer):
#     # check if layer is a group and drill down if it is
#     if pdb.gimp_item_is_group(layer):
#         gr = layer
#         gr_items = pdb.gimp_item_get_children(layer)
#         for index in gr_items[1]:
#             item = gimp.Item.from_id(index)

#     # if layer is on the first level
#     if layer.name == name:
#         return layer
#         return None


def process(infile):

    print "Processing file %s " % infile
    image = pdb.gimp_xcf_load(0, infile, infile)
    print "File %s loaded OK" % infile

    # save image layers
    layersDir = os.path.splitext(infile)[0] + '-layers'
    if not os.path.exists(layersDir):
        os.mkdir(layersDir)

    for l in image.layers:
        save_layer(image, l, layersDir)

    pdb.gimp_image_delete(image)


def run(directory):
    start = time.time()
    print "Running on directory \"%s\"" % directory
    for infile in glob.glob(os.path.join(directory, '*.xcf')):
        process(infile)
    end = time.time()
    print "Finished, total processing time: %.2f seconds" % (end-start)


if __name__ == "__main__":
    print "Running as __main__ with args: %s" % sys.argv
