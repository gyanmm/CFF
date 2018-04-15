/// <reference path="./admin.d.ts"/>
import * as React from 'react';
import {flatten} from 'flat';
import * as queryString from "query-string";
import {pick, get, set, find} from "lodash-es";
import FormPage from "../form/FormPage";
import FormEmbed from "./FormEmbed";
import CenterList from "./CenterList/CenterList";
import FormList from "./FormList/FormList";
import FormEdit from "./FormEdit/FormEdit";
import ResponseTable from "./ResponseTable/ResponseTable";
import ResponseSummary from "./ResponseSummary/ResponseSummary"
import FormShare from "./FormShare/FormShare"
import Loading from "src/common/Loading/Loading";
import "./admin.scss";
import "open-iconic/font/css/open-iconic-bootstrap.scss";
import { withAuthenticator } from 'aws-amplify-react';
import { Auth, API } from 'aws-amplify';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

const STATUS_LOADING = 0;
const STATUS_ERROR = 11;
const STATUS_ACCESS_DENIED = 21;
const STATUS_CENTER_LIST = 31;
const STATUS_FORM_LIST = 41;
const STATUS_FORM_RENDER = 51; // Not used.
const STATUS_FORM_RESPONSES = 61;
const STATUS_FORM_RESPONSE_SUMMARY = 62;
const STATUS_FORM_EMBED = 71;
const STATUS_FORM_EDIT = 81;

class FormAdminPage extends React.Component<IFormAdminPageProps, IFormAdminPageState> {
    constructor(props:any) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {
            centerList: [],
            formList: [],
            center: null,
            selectedForm: null,
            status: STATUS_LOADING,
            hasError: false,
            user: {id: "", name: "", email: ""},
            apiKey: null,
            loading: false
        }
    }

    editForm(form) {
        this.setState({
            selectedForm: form,
            status: STATUS_FORM_EDIT
        });
    }

    embedForm(form) {
        this.setState({
            selectedForm: form,
            status: STATUS_FORM_EMBED
        })
    }

    componentDidUpdate(prevProps, prevState) {
        /*let stateKeysToEncode = ["selectedForm.name", "selectedForm.center", "selectedForm.id", "center", "status"];
        if (pick(this.state, stateKeysToEncode) != pick(prevState, stateKeysToEncode)) {
            let encodedState = flatten(pick(this.state, stateKeysToEncode));
            let newQS = queryString.stringify(encodedState);
            window.location.hash = newQS;//queryString.stringify(encodedState);   
        }*/
    }


    loadResponses(form) {
        this.setState({
            selectedForm: form,
            status: STATUS_FORM_RESPONSES
        });
    }
    loadResponseSummary(form) {
        this.setState({
            selectedForm: form,
            status: STATUS_FORM_RESPONSE_SUMMARY
        })
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps, nextProps.authState);
        if (this.props.authState != "signedIn" && nextProps.authState == "signedIn") {

        }
    }
    componentWillMount() {
        Auth.currentCredentials().then(creds => {
            Auth.currentUserInfo().then(e => {
                console.warn(e);
                if (!e) {
                    Auth.signOut();
                    return;
                }
                let currentUser = pick(e, ["id", "name", "email"]);
                if (!currentUser.id) {
                    currentUser.id = creds.params.IdentityId;
                }
                currentUser.id = "cff:cognitoIdentityId:" + currentUser.id;
                this.setState({user: currentUser}); // , this.loadCenters);
                console.log(currentUser);
            });
        });
    }
    componentDidMount() {
        this.loadCenters();
    }
    loadCenters() {
        this.setState({"status": STATUS_CENTER_LIST});
    }
    handleError(e) {
        this.setState({"hasError": true});
    }
    componentDidCatch(error, info) {
        // Display fallback UI
        console.error("ERROR", error);
        this.setState({ status: STATUS_ACCESS_DENIED, hasError: true });
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, info);
    }
    onUnauth(error) {
        console.warn(error);
        this.setState({ status: STATUS_ACCESS_DENIED, hasError: true });
        // throw error;
    }
    onError(error) {
        this.onLoadEnd();
        this.setState({hasError: true});
        // if (error == "No credentials") {

        // }
        alert(error);
    }
    onLoadStart(e=null) {
        this.setState({"loading": true});
    }
    onLoadEnd(e=null) {
        this.setState({"loading": false});
    }
    render() {
        if (this.state.status == STATUS_ACCESS_DENIED) {
            return <AccessDenied userId={this.state.user.id} />;
        }
        if (this.state.hasError) {
            return <Loading hasError={true} />;
        }
        return (<Router>
            <div>
            <Route path="/" render={(props) =>
                {return this.state.user.id ? 
                    <CenterList {...props} user={this.state.user} onError={e => this.onUnauth(e)} /> : null
                }
            }
            />
            <Route path="/:centerSlug/:centerId" render={props =>
                <FormList key={props.match.params.centerSlug} onError={e => this.onError(e)} userId={this.state.user.id} {...props} />
            }/>
            <Route path="/:centerSlug/:centerId/:formId" component={FormPages} />
            </div>
        </Router>);

        }
}
function FormPages() {
    return (<Switch>
        <Route path='/:centerSlug/:centerId/:formId/responses' exact render={({match}) => <Redirect to={`/${match.params.centerSlug}/${match.params.centerId}/${match.params.formId}/responses/all`} />} />
        <Route path='/:centerSlug/:centerId/:formId/responsesEdit' exact render={({match}) => <Redirect to={`/${match.params.centerSlug}/${match.params.centerId}/${match.params.formId}/responsesEdit/all`} />} />
        <Route path="/:centerSlug/:centerId/:formId/responses/:tableViewName" render={props =>
            <ResponseTable key={props.match.params.formId} editMode={false} onError={e => this.onError(e)} {...props} />
        }/>
        <Route path="/:centerSlug/:centerId/:formId/responsesEdit" render={props =>
            <ResponseTable key={props.match.params.formId} editMode={true} onError={e => this.onError(e)} {...props} />
        }/>
        <Route path="/:centerSlug/:centerId/:formId/summary" render={props =>
            <ResponseSummary key={props.match.params.formId} onError={e => this.onError(e)} {...props} />
        }/>
        <Route path="/:centerSlug/:centerId/:formId/share" render={props =>
            <FormShare key={props.match.params.formId} onError={e => this.onError(e)} {...props} />
        }/>
    </Switch>);
}
function AccessDenied(props) {
    return (<div>
        <h4><b>Access denied</b></h4>
            <p>To finish setting up your account, please contact an administrator and give them your id:</p>
            <pre className="cff-copy-box">{props.userId}</pre>
    </div>);
}
/*
class Other {
    render2() {
        if (this.state.status == STATUS_LOADING) {
            return <Loading hasError={this.state.hasError} />;
        }

        return (
        <div className="App FormAdminPage">
            <h1>CCMT Form Admin - {this.state.center && this.state.center.name}</h1>
            <p>User id: {this.state.userId}</p>
            Change center:
            <select className="form-control" value={this.state.center.id} onChange={(e) => {
                let selectedCenter = find(this.state.centerList, {"id": parseInt(e.target.value)});
                this.setState({center: selectedCenter, status: STATUS_LOADING}, this.loadFormList);
            }}>
            {this.state.centerList.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            {this.state.status != STATUS_FORM_LIST && 
                <a href="#" onClick={() => {window.location.hash=""; this.loadFormList(); } }>Back to form list</a>
            }
            {this.state.status != STATUS_ACCESS_DENIED && this.state.formList && <FormList
                apiEndpoint={this.props.apiEndpoint}
                apiKey={this.state.apiKey}
                editForm = {(e) => this.editForm(e)}
                embedForm = {(e) => this.embedForm(e)}
                loadResponses= {(e) => this.loadResponses(e)} 
                loadResponseSummary = {(e) => this.loadResponseSummary(e)}
                formList = {this.state.status == STATUS_FORM_LIST ? this.state.formList : [this.state.selectedForm]} />}
            {this.state.status == STATUS_FORM_EMBED && 
                <FormEmbed form={this.state.selectedForm} apiEndpoint={this.props.apiEndpoint} />
            }
            {this.state.status == STATUS_FORM_EDIT && 
                <FormEdit form={this.state.selectedForm} apiEndpoint={this.props.apiEndpoint} apiKey={this.state.apiKey} />
            }
            {this.state.status == STATUS_FORM_RESPONSES &&
                <ResponseTable form={this.state.selectedForm} apiEndpoint={this.props.apiEndpoint} apiKey={this.state.apiKey}
                    handleError={(e) => this.handleError(e)} />
            }
        </div>
        );
    }
}
*/

export default withAuthenticator(FormAdminPage, { includeGreetings: true });