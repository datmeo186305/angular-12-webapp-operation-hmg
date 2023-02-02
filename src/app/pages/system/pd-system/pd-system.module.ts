import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../share/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { TitleConstants } from '../../../core/common/constants/title-constants';
import { PdAnswersListComponent } from './pd-answers/pd-answers-list/pd-answers-list.component';
import { PdGroupListComponent } from './pd-group/pd-group-list/pd-group-list.component';
import { PdModelListComponent } from './pd-model/pd-model-list/pd-model-list.component';
import { PdQuestionsListComponent } from './pd-questions/pd-questions-list/pd-questions-list.component';
import { PdAnswersElementComponent } from './pd-answers/components/pd-answers-element/pd-answers-element.component';
import { PdGroupElementComponent } from './pd-group/components/pd-group-element/pd-group-element.component';
import { PdModelElementComponent } from './pd-model/components/pd-model-element/pd-model-element.component';
import { PdQuestionElementComponent } from './pd-questions/components/pd-question-element/pd-question-element.component';

export const PdSystemRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'pd-answers',
        component: PdAnswersListComponent,
        data: { title: TitleConstants.TITLE_VALUE.PD_ANSWER, animation: true },
      },
      {
        path: 'pd-group',
        component: PdGroupListComponent,
        data: { title: TitleConstants.TITLE_VALUE.PD_GROUP, animation: true },
      },
      {
        path: 'pd-model',
        component: PdModelListComponent,
        data: { title: TitleConstants.TITLE_VALUE.PD_MODEL, animation: true },
      },
      {
        path: 'pd-questions',
        component: PdQuestionsListComponent,
        data: {
          title: TitleConstants.TITLE_VALUE.PD_QUESTION,
          animation: true,
        },
      },
    ],
  },
];

@NgModule({
  declarations: [
    PdAnswersListComponent,
    PdGroupListComponent,
    PdModelListComponent,
    PdQuestionsListComponent,
    PdAnswersElementComponent,
    PdGroupElementComponent,
    PdModelElementComponent,
    PdQuestionElementComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PdSystemRoutes),
    SharedModule,
    TranslateModule,
    FormsModule,
  ],
})
export class PdSystemModule {}
