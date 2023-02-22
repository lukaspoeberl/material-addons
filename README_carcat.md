# How to use this Fork for carCAT-development

## Open TODOs
- adapt the examples to the new styles 
- modernize the examples


## Use lib for carCAT

### Use Jenkins / Arifactory
If you just want to use the current fork lib version you can use the version that is pushed to the POI Artifactory:

#### Publish to POI Artifactory

Increase the version number (you can not publish an already existing version) in

```projects/material-addons/package.json```

Execute the following steps:

```
export/set CARFIN_NPM_TOKEN=xxx
npm install
npm run build:mat-add
npm publish ./dist/material-addons
```

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
- do not include the copyToCarcat/deploy script (package.json)
- change the npmrc back to the public rNPM-repo (or just du not merge)

# Misc
I had several problems pushing the addons to the POI Artifactory. Putting the following lines 
to the ```.npmrc``` made it work locally:

```
@porscheinformatik:registry=https://artifactory.porscheinformatik.com/artifactory/api/npm/npm-carfin/
//artifactory.porscheinformatik.com/artifactory/api/npm/npm-carfin/:always-auth true
/artifactory.porscheinformatik.com/artifactory/api/npm/npm-carfin/:_authToken $CARFIN_NPM_TOKEN
```

I also tried the same thing with a build-job on Jenkins. But for some reason there is always a problem with the token.
I also tried the put it as npm config (as we did for Global-Services or Carin), but no success.
(see Jenkins folder for one of the last tries and Jenkins build-job: 
https://build.porscheinformatik.com/jenkins/job/FS/job/carcat/job/carCAT_material_addons )
