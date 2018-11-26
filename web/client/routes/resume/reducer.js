import { Record, Map, List, isKeyed, isIndexed } from 'immutable';
import { buildResume } from '#app/util/resume';
import steps from './steps';

let work = Record({
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    duties: [],
});

let education = Record({
    institution: '',
    qualification: '',
    startDate: '',
    endDate: '',
});

let skill = Record({
    name: '',
    level: '',
});

let competency = '';

let award = Record({
    title: '',
    year: '',
});

let referees = Map({
    employment: Map({
        name: '',
        position: '',
        company: '',
        telephone: '',
    }),
    character: Map({
        name: '',
        position: '',
        telephone: '',
    }),
    academic: Map({
        name: '',
        position: '',
        institution: '',
        telephone: '',
    }),
});

let certification = '';

let basics = Map({
    name: '',
    dob: '',
    address: '',
    email: '',
    phone: '',
    location: '',
    personalStatement: '',
    jobTitle: '',
});

let preferences = Map({
    jobSector: '',
    jobSectorAlt: '',
    level: '',
    salaryExpectation: '',
    location: '',
    jobType: '',
});

const meta = Map({
    attached_cv: '',
    attached_cl: '',
    signMeUpForUpdates: false,
    public: false,
});

export const structure = {
    basics,
    preferences,
    work,
    education,
    competency,
    skill,
    award,
    certification,
    referees,
    meta,
};

export const keys = {
    basics: 'basics',
    preferences: 'preferences',
    work: 'work',
    education: 'education',
    competency: 'competencies',
    skill: 'skills',
    award: 'awards',
    certification: 'certifications',
    referees: 'referees',
    meta: 'meta',
};

export const values = {
    basics: 'basics',
    preferences: 'preferences',
    work: 'work',
    education: 'education',
    competencies: 'competency',
    skills: 'skill',
    awards: 'award',
    certifications: 'certification',
    referees: 'referees',
    meta: 'meta',
};

export const Resume = new Record({
    basics: basics,
    preferences: preferences,
    work: List(),
    education: List(),
    competencies: List(),
    skills: List(),
    awards: List(),
    certifications: List(),
    referees: referees,
    meta: meta,
});

export const initialState = Map({
    loading: false,
    loadFailed: false,
    currentStep: 0,
    resumeCompleted: false,
    failureMessage: '',
    raw: {},
    resumeFile: '',
    coverLetterFile: '',
    data: Resume({
        basics: Map({
            name: '',
            dob: '',
            address: '',
            email: '',
            phone: '',
            personalStatement: '',
        }),
        preferences,
        work: List([work({duties: [""]})]),
        education: List([education({})]),
        competencies: List(['']),
        skills: List([skill({})]),
        awards: List([award({})]),
        certifications: List(['']),
        referees: referees,
        meta: meta,
    }),
});

const ResumeReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_FIELD':
            const fieldname = values[action.field];
            if (typeof structure[fieldname] == 'undefined') return state;
            const newStructure = structure[fieldname];
            
            return state.update('data', record => record.update(action.field, arr => arr.insert(arr.size, newStructure({}))));
        case 'REMOVE_FIELD':
            const fieldToEdit = keys[action.field];
            const removeAt = action.removeAt;
            return state.update('data', record => record.update(fieldToEdit, arr => arr.remove(removeAt)));
        case 'SET_FIELD':
            const { field, key, index, value } = action;
            // updates can be strings or array but not an object
            if (typeof value == 'object' && !Array.isArray(value)) {
                return state;
            }

            const setFieldName = keys[field];

            // check field size and create new entry if field does not exist
            return state.update('data', record => {
                if (key) {
                    if (index != -1) {
                        return record.update(setFieldName, list => {
                                return list.update(index, map => map.setIn(key.split('.'), value))
                            }
                        );
                    }

                    return record.update(setFieldName, obj => obj.setIn(key.split('.'), value));
                } else {
                    return record.update(setFieldName, arr => List(value));
                }
            });
        case 'INIT_RESUME':
            return state.merge({data: buildResume(action.resume)});
        case 'SAVE_RESUME_REQUEST':
            return state.set('loading', true);
        case 'SAVE_RESUME':
            if (action.res.success && !action.res.done) {
                return state.merge({
                    currentStep: action.res.next_stage,
                    loading: false,
                });
            } else if (action.res.done) {
                return state.merge({
                    loading: false,
                    resumeCompleted: true,
                });
            }

            return state;
        case 'SAVE_RESUME_FAILURE':
            return state.set('loading', false);
        case 'SET_CURRENT_STEP':
            if (action.step == steps.length) {
                return state.merge({
                    resumeCompleted: true,
                    currentStep: action.step,
                });
            }

            return state.set('currentStep', action.step);
        case 'SET_RESUMEBUILDER_LOADING':
            return state.set('loading', true);
        case 'SET_RESUMEBUILDER_DONE_LOADING':
            if (typeof action.credentials != 'undefined') {
                state = state.update('data', record => {
                    record = record.update('basics', obj => obj.set('email', action.credentials.email));
                    record = record.update('basics', obj => obj.set('name', action.credentials.name));
                    return record;
                });

                return state.set('loading', false);
            } else {
                return state.set('loading', false);
            }
        default:
            return state;
    }
};

export default ResumeReducer;