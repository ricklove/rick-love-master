#!/usr/bin/python

import os
import glob
import sys
import time
from gimpfu import *

import sys


nextIndex = 0


def save_layer(image, layer, layersDir):
    global nextIndex
    print "Saving layer %s" % layer.name

    outfile = layersDir + '/' + \
        str(nextIndex).rjust(4, '0') + '-' + layer.name + '.png'

    print "Saving to %s" % outfile
    pdb.file_png_save(image, layer, outfile, outfile, True,
                      9, True, True, True, True, True)
    print "Saved to %s" % outfile
    nextIndex = nextIndex + 1


def save_layer_or_group(image, layer, layersDir):
    # check if layer is a group and drill down if it is
    if pdb.gimp_item_is_group(layer):
        gr = layer
        gr_items = pdb.gimp_item_get_children(layer)
        for index in gr_items[1]:
            item = gimp.Item.from_id(index)
            save_layer_or_group(image, item, layersDir)
        return

    # if not a group
    save_layer(image, layer, layersDir)


def process(infile, outDirectory):
    global nextIndex
    nextIndex = 0

    print "Processing file %s " % infile
    image = pdb.gimp_xcf_load(0, infile, infile)
    print "File %s loaded OK" % infile

    # save image layers
    layersDir = os.path.join(
        outDirectory, os.path.splitext(os.path.basename(infile))[0])

    print "layersDir %s" % layersDir

    if not os.path.exists(layersDir):
        os.mkdir(layersDir)

    for l in image.layers:
        save_layer_or_group(image, l, layersDir)

    pdb.gimp_image_delete(image)


def run(directory, outDirectory):

    sys.stderr = open(os.path.join(outDirectory, 'gimpstderr.log'), 'w')
    sys.stdout = open(os.path.join(outDirectory, 'gimpstdout.log'), 'w')

    start = time.time()
    print "Running on directory \"%s\"" % directory
    for infile in glob.glob(os.path.join(directory, '*.xcf')):
        process(infile, outDirectory)
    end = time.time()
    print "Finished, total processing time: %.2f seconds" % (end-start)


if __name__ == "__main__":
    print "Running as __main__ with args: %s" % sys.argv
