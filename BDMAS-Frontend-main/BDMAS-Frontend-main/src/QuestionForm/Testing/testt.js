import React,{Component, Fragment} from 'react'
// import * as Survey from "survey-knockout";
// import * as SurveyCreator from "survey-creator-react";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';



import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
// Import CSS files for SurveyJS (survey-core) and Survey Creator
import "survey-core/defaultV2.min.css";
import "survey-creator-core/survey-creator-core.min.css";

 class Testt  extends Component{
    constructor() {
      super();
      // Instantiate Survey Creator
      this.creator = new SurveyCreator();
      // Enable auto save
      // this.creator.isAutoSave = true;
      this.creator.showJSONEditorTab = false; 
      this.creator.showPreview= false;
      // Show notifications before and after a survey definition JSON is saved
      this.creator.showState = true;
      // Save the survey definition JSON to your web service
      this.creator.saveSurveyFunc = (saveNo, callback) => {
        // Call a function on your web service to store the survey definition JSON
        // As an alternative to this.creator.JSON, you can use the this.creator.text string property
        // saveSurveyJSON(this.id, this.creator.JSON, () => {
        //   callback(saveNo, true);
        // });
      };
    }
    componentDidMount() {
      // Load a survey definition JSON from you web service
      // ...
      // Assign the survey definition to Survey Creator
      // this.creator.JSON = yourJSON;
    }
    render() {
      return (

        <Fragment>
          <Button>bootstrap</Button>
          <SurveyCreatorComponent creator={this.creator} onComplete={(form)=>{console.log(form.JSON)}}  />
        </Fragment>
      );
    }
  }
  export default Testt;