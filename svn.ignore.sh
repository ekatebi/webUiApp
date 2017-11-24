#!/bin/bash
svn propset svn:ignore -F .svn.ignore .
svn propget svn:ignore
# svn proplist
# svn status --no-ignore
