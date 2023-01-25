import { StepComponent, StepperComponent } from './stepper.component';
import { StepHeaderComponent } from './step-header/step-header.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CdkStepperModule } from '@angular/cdk/stepper';

@NgModule({
  declarations: [StepperComponent, StepHeaderComponent, StepComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, CdkStepperModule],
  exports: [StepperComponent, StepHeaderComponent, StepComponent],
})
export class StepperModule {}
