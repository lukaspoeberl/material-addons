#!/usr/bin/env
// This jenkins pipeline builds the snapshot version for master and release branches and makes the verify build for PR.
// In case of snapshot the artifact and image is uploaded.
@Library('financialservices') _

mailNotificationParams = [ emailAddress: "lukas.poeberl@porscheinformatik.com"
                         ]

pipelineParams = [ buildFolder: '',
                   cronTrigger: '@weekly',
                   jdkVersion: 'jdk-17',
                   additionalParams: '',
                   dockerEnabled: true,
                   sendErrorNotification: false,
                   failureNotification: [],
                   failureEmailNotification: mailNotificationParams,
                   dockerPushPRBranch: true
]

moduleBuildPipeline(pipelineParams)
