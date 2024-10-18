#!/bin/bash

# Import the database dump
pg_restore -h localhost -U postgres -d devfest -v src/db_backups/devfest.dump
