#!/usr/bin/python

import os
import glob
import sys
import time
from gimpfu import *


def process(infile):

    print "Processing file %s " % infile
    image = pdb.gimp_xcf_load(0, infile, infile)
    print "File %s loaded OK" % infile

    # save image layers
    layersDir = os.path.splitext(infile)[0] + '-layers'
    if not os.path.exists(layersDir):
        os.mkdir(layersDir)

    for i, l in enumerate(image.layers):
        print "Saving layer %s" % l.name

        outfile = layersDir + '/' + str(i) + '-' + l.name + '.png'

        print "Saving to %s" % outfile
        pdb.file_png_save(image, l, outfile, outfile, True,
                          9, True, True, True, True, True)
        print "Saved to %s" % outfile

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
