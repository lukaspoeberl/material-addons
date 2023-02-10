# How to use this Fork for carCAT-development

## Open TODOs
- adapt the examples to the new styles 
- modernize the examples


## Use lib for carCAT

### Use Jenkins / Arifactory
If you just want to use the current fork lib version you can use the version that is pushed to the POI Artifactory:

But that mean:
 - Whenever an update is required make sure you execute the Jenkins build-job to build and publish the artifact into the POI npm repo:
https://build.porscheinformatik.com/jenkins/job/FS/job/carCAT/job/carCAT-material-addons/
 - make sure the version number matches the current version number used in the package.json

### use local development version

If you develop new features for the Addons (and want to test them locally before pushing the changes), you 
can use the copy-script:

1. adapt the version number (projects/material-addons/package.json) if you add new features
2. Bild an copy the add-ons lib: ```npm run build:mat-add && npm run copyToCarcat```
3. update the version number of the addons in carCAT
4. update carCAT (npm install, sometimes you have to delete the lock-file)

## Develop Material Addons

Start the addons as a developer:
- ```npm run build-and-serve``` (you could add the --port property tp change the serve-port, just in case you want to run carCAT in parallel)
- open a page to test (e.g. http://localhost:4200/full-page-layouts/sidebar-page-layout/1)

# Merge back to the official repo
When the time comes to merge back our changes to the official repo, the following files should NOT be merged back:

- do not merge the Jenkins folder and the pom.xml (that is just required for the npm push into the Artifactory)
- do not include the copyToCarcat script (package.json)
