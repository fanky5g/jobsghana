#!/usr/bin/env bash

stale_images=`docker images --no-trunc --quiet --filter "dangling=true"`
stale_containers=`docker ps --no-trunc --quiet --filter "status=exited"`
stale_volumes=`docker volume ls --quiet --filter "dangling=true"`
stale_images_count=`echo "$stale_images" | sed '/^\s*$/d' | wc -l | xargs`
stale_containers_count=`echo "$stale_containers" | sed '/^\s*$/d' | wc -l | xargs`
stale_volumes_count=`echo "$stale_volumes" | sed '/^\s*$/d' | wc -l | xargs`

echo "Removing stale containers..."
docker rm $stale_containers 2>/dev/null || true
echo "Removing stale images..."
docker rmi $stale_images 2>/dev/null || true
echo "Removing stale volumes..."
docker volume rm $stale_volumes 2>/dev/null || true

active_images=`echo "$(docker images --no-trunc --quiet --filter 'dangling=false')" | sed '/^\s*$/d' | wc -l | xargs`
active_containers=`echo "$(docker ps --no-trunc --quiet --filter 'status=running')" | sed '/^\s*$/d' | wc -l | xargs`
active_volumes=`echo "$(docker volume ls --quiet --filter 'dangling=false')" | sed '/^\s*$/d' | wc -l | xargs`

echo "Removed $stale_images_count stale images ($active_images active)."
echo "Removed $stale_containers_count stale containers ($active_containers active)."
echo "Removed $stale_volumes_count stale volumes ($active_volumes active)."