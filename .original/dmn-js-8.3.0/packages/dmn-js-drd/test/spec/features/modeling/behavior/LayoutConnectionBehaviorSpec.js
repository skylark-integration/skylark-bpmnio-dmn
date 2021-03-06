import {
  bootstrapModeler,
  inject
} from '../../../../TestHelper';

import coreModule from 'src/core';
import modelingModule from 'src/features/modeling';

import { getMid } from 'diagram-js/lib/layout/LayoutUtil';


describe('features/modeling - layout connection', function() {

  var testModules = [
    coreModule,
    modelingModule
  ];

  var diagramXML = require('./layout-connection-behavior.dmn');

  beforeEach(bootstrapModeler(diagramXML, {
    modules: testModules
  }));


  describe('specify connection start and end', function() {

    describe('connection create', function() {

      it('should specify connection start and end for dmn:Decision', inject(
        function(elementRegistry, modeling) {

          // given
          var decision1 = elementRegistry.get('Decision_1'),
              decision2 = elementRegistry.get('Decision_2');

          // when
          var connection = modeling.connect(decision2, decision1);

          // then
          expect(connection.waypoints).to.eql([
            {
              original: {
                x: 610,
                y: 340
              },
              x: 610,
              y: 340
            },
            {
              x: 250,
              y: 280
            },
            {
              original: {
                x: 250,
                y: 260
              },
              x: 250,
              y: 260
            }
          ]);
        }
      ));


      it('should NOT specify connection start and end for dmn:KnowledgeSource', inject(
        function(elementRegistry, modeling) {

          // given
          var decision1 = elementRegistry.get('Decision_1'),
              knowledgeSource = elementRegistry.get('KnowledgeSource_1');

          // when
          var connection = modeling.connect(knowledgeSource, decision1);

          // then
          expect(connection.waypoints).to.have.length(2);

          expect(connection.waypoints[ 0 ].original).to.eql(getMid(knowledgeSource));
          expect(connection.waypoints[ 1 ].original).to.eql(getMid(decision1));
        }
      ));


      it('should NOT specify connection start and end for dmn:TextAnnotation', inject(
        function(elementRegistry, modeling) {

          // given
          var decision1 = elementRegistry.get('Decision_1'),
              textAnnotation = elementRegistry.get('TextAnnotation_1');

          // when
          var connection = modeling.connect(textAnnotation, decision1);

          // then
          expect(connection.waypoints).to.have.length(2);

          expect(connection.waypoints[ 0 ].original).to.eql(getMid(textAnnotation));
          expect(connection.waypoints[ 1 ].original).to.eql(getMid(decision1));
        }
      ));

    });


    describe('connection reconnect', function() {

      it('should specify connection start and end for dmn:Decision', inject(
        function(elementRegistry, modeling) {

          // given
          var decision2 = elementRegistry.get('Decision_2'),
              informationRequirement = elementRegistry.get('InformationRequirement_1');

          // when
          modeling.reconnectEnd(informationRequirement, decision2, getMid(decision2));

          // then
          expect(informationRequirement.waypoints).to.eql([
            {
              original: {
                x: 740,
                y: 380
              },
              x: 740,
              y: 380
            },
            {
              x: 720,
              y: 380
            },
            {
              original: {
                x: 700,
                y: 380
              },
              x: 700,
              y: 380
            }
          ]);
        }
      ));

    });

  });


  describe('update information requirements', function() {

    describe('connection create', function() {

      it('should update information requirements', inject(
        function(elementRegistry, modeling) {

          // given
          var decision2 = elementRegistry.get('Decision_2'),
              decision3 = elementRegistry.get('Decision_3'),
              informationRequirement = elementRegistry.get('InformationRequirement_1');

          // when
          var connection = modeling.connect(decision2, decision3);

          // then
          expect(getLastWaypoint(connection)).eql({
            original: {
              x: 800,
              y: 260
            },
            x: 800,
            y: 260
          });

          expect(getLastWaypoint(informationRequirement)).eql({
            original: {
              x: 860,
              y: 260
            },
            x: 860,
            y: 260
          });
        }
      ));

    });


    describe('connection remove', function() {

      it('should update information requirements', inject(
        function(elementRegistry, modeling) {

          // given
          var decision2 = elementRegistry.get('Decision_2'),
              decision3 = elementRegistry.get('Decision_3'),
              informationRequirement = elementRegistry.get('InformationRequirement_1');

          var connection = modeling.connect(decision2, decision3);

          // when
          modeling.removeConnection(connection);

          // then
          expect(getLastWaypoint(informationRequirement)).eql({
            original: {
              x: 830,
              y: 260
            },
            x: 830,
            y: 260
          });
        }
      ));

    });


    describe('connection reconnect', function() {

      it('should update information requirements', inject(
        function(elementRegistry, modeling) {

          // given
          var decision8 = elementRegistry.get('Decision_8'),
              informationRequirement2 = elementRegistry.get('InformationRequirement_2'),
              informationRequirement3 = elementRegistry.get('InformationRequirement_3'),
              informationRequirement4 = elementRegistry.get('InformationRequirement_4'),
              informationRequirement5 = elementRegistry.get('InformationRequirement_5');

          // when
          modeling.reconnectEnd(informationRequirement2, decision8, getMid(decision8));

          // then
          expect(getLastWaypoint(informationRequirement3)).to.eql({
            original: {
              x: 1050,
              y: 260
            },
            x: 1050,
            y: 260
          });

          expect(getLastWaypoint(informationRequirement4)).to.eql({
            original: {
              x: 1490,
              y: 260
            },
            x: 1490,
            y: 260
          });

          expect(getLastWaypoint(informationRequirement5)).to.eql({
            original: {
              x: 1535,
              y: 260
            },
            x: 1535,
            y: 260
          });
        }
      ));

    });


    describe('elements move', function() {

      it('should update information requirements', inject(
        function(elementRegistry, modeling) {

          // given
          var decision2 = elementRegistry.get('Decision_2'),
              decision4 = elementRegistry.get('Decision_4'),
              informationRequirement = elementRegistry.get('InformationRequirement_1');

          var connection = modeling.connect(decision2, decision4);

          // when
          modeling.moveElements([ decision4 ], { x: -250, y: -150 });

          // then
          expect(informationRequirement.waypoints).to.eql([
            {
              original: {
                x: 670,
                y: 230
              },
              x: 670,
              y: 230
            },
            {
              x: 720,
              y: 220
            },
            {
              original: {
                x: 740,
                y: 220
              },
              x: 740,
              y: 220
            }
          ]);

          expect(connection.waypoints).to.eql([
            {
              original: {
                x: 610,
                y: 340
              },
              x: 610,
              y: 340
            },
            {
              x: 580,
              y: 290
            },
            {
              original: {
                x: 580,
                y: 270
              },
              x: 580,
              y: 270
            }
          ]);
        }
      ));

    });

  });

});


// helpers //////////

function getLastWaypoint(connection) {
  var waypoints = connection.waypoints;

  return waypoints[ waypoints.length - 1 ];
}