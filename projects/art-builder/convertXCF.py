#!/usr/bin/python

import os,glob,sys,time
from gimpfu import *

def process(infile):
        print "Processing file %s " % infile
        image = pdb.gimp_xcf_load(0,infile,infile)
        print "File %s loaded OK" % infile
        # The API saves a layer, so make a layer from the visible image
        savedlayer = pdb.gimp_layer_new_from_visible(image,image,"Saved image")
        outfile=os.path.splitext(infile)[0]+'.png'
        print "Saving to %s" % outfile
        pdb.file_png_save(image,savedlayer,outfile, outfile,True,9,True,True,True,True,True)
        print "Saved to %s" % outfile
        pdb.gimp_image_delete(image)


def run(directory):
        start=time.time()
        print "Running on directory \"%s\"" % directory
        for infile in glob.glob(os.path.join(directory, '*.xcf')):
                process(infile)
        end=time.time()
        print "Finished, total processing time: %.2f seconds" % (end-start)


if __name__ == "__main__":
        print "Running as __main__ with args: %s" % sys.argv