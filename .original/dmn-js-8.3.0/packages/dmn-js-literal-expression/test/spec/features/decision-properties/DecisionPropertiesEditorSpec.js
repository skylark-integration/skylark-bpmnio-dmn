import { bootstrapModeler, inject } from 'test/helper';

import { triggerInputEvent } from 'dmn-js-shared/test/util/EventUtil';

import { queryEditor } from 'dmn-js-shared/test/util/EditorUtil';

import { classes as domClasses, query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import literalExpressionXML from '../../literal-expression.dmn';

import DecisionPropertiesEditorModule from 'src/features/decision-properties/editor';

import CoreModule from 'src/core';
import ModelingModule from 'src/features/modeling';


describe('decision properties editor', function() {

  beforeEach(bootstrapModeler(literalExpressionXML, {
    modules: [
      CoreModule,
      DecisionPropertiesEditorModule,
      ModelingModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should render', function() {

    // then
    expect(domQuery('.decision-properties', testContainer)).to.exist;
  });


  it('should edit decision name', inject(function(viewer) {

    // given
    const editor = queryEditor('.decision-name', testContainer);

    editor.focus();

    // when
    triggerInputEvent(editor, 'foo');

    // then
    expect(viewer.getDecision().name).to.equal('foo');
  }));


  it('should edit decision id', inject(function(viewer) {

    // given
    const editor = queryEditor('.decision-id', testContainer);

    editor.focus();

    // when
    triggerInputEvent(editor, 'foo');

    // then
    expect(viewer.getDecision().id).to.equal('foo');
  }));


  it('should validate decision id', inject(function(viewer) {

    // given
    const decisionId = domQuery('.decision-id', testContainer);
    const editor = queryEditor('.decision-id', testContainer);

    editor.focus();

    // when
    triggerInputEvent(editor, 'foo bar');

    // then
    expect(viewer.getDecision().id).to.equal('season');

    expect(domClasses(decisionId).has('invalid')).to.be.true;
  }));

});