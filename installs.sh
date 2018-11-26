#!/bin/bash
if !glide 2> /dev/null; then
  echo "installing glide golang vendoring tool"
  curl https://glide.sh/get | sh
fi