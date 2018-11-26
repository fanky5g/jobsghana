import isEqual from 'lodash/isEqual';
import values from 'lodash/values';
import moment from 'moment';
import { List } from 'immutable';

import { values as v, structure, Resume } from '#app/routes/resume/reducer';

export const cleanResume = (resume) => {
    const keys = Object.keys(resume);
    keys.forEach(key => {
        const fieldKey = v[key];
        let struct = structure[fieldKey];
        let model;

        if (typeof struct == "function") {
            model = struct().toJSON();
        } else if (typeof struct == "string") {
            model = struct;
        } else {
            model = struct.toJSON();
        }

        if (Array.isArray(resume[key])) {
            if (resume[key].length == 0) {
                delete resume[key];
            } else {
                resume[key].forEach((item, index) => {
                    const itemEmpty = isEqual(model, item);
                    if (typeof item == 'object') {
                        if (objectEmpty(item) || itemEmpty) {
                            resume[key] = [...resume[key].splice(0, index), ...resume[key].splice(index + 1)]
                        }
                    } else if(typeof item == 'string') {
                        if (itemEmpty) {
                            resume[key] = [...resume[key].splice(0, index), ...resume[key].splice(index + 1)]
                        }
                    }
                });

                // recheck if key is now empty, then delete
                if (resume[key].length == 0) {
                    delete resume[key];
                }
            }
        } else if (objectEmpty(resume[key]) || isEqual(model, resume[key])) {
            delete resume[key];
        }
    });

    return resume;
};

export const buildResume = (jsonobject) => {
    let resume = Resume({});

    Object.keys(jsonobject).map(key => {
        let struct = structure[v[key]];
        let item = jsonobject[key];
        
        if (typeof struct == "function") {
            if (Array.isArray(item)) {
                let entries = item.map((entry) => {
                    return struct(entry);
                });
                resume = resume.set(key, entries);
            } else {
                struct = struct(jsonobject[key]);
                resume = resume.set(key, struct);
            }
        } else if (typeof struct == "string" && Array.isArray(item) ) {
            resume = resume.set(key, List(item));
        } else {
            if (struct) {
                struct = struct.merge(jsonobject[key]);
            }
            resume = resume.set(key, struct);
        }
    });

    return resume.toJSON();
};

export const objectEmpty = (o) => {
    return !values(o).some(x => x !== undefined);
};

export const getYearsOfExperience = (workExperience) => {
    if (!Array.isArray(workExperience)) {
        return 0;
    }

    // push all startdates and enddates into array and sort

    // const dateRanges = workExperience.reduce((prev, curr, next) => {
    //     var dates = [];
    //     const startDate = curr.startDate;
    //     const endDate = curr.endDate;
    //     if (startDate) {
    //         dates.push(moment(startDate, 'YYYY-MM-DD'));
    //     }

    //     if (endDate) {
    //         dates.push(moment(endDate, 'YYYY-MM-DD'));
    //     }

    //     return dates.length ? prev.concat(dates): prev;
    // }, []);

    const dateRanges = workExperience.map(year => moment(year).format('YYYY-MM-DD'));
    const sortedDateRange = dateRanges.sort(function (left, right) {
        return moment.utc(left).diff(moment.utc(right));
    });

    let yearsOfExperience = 0;
    if (sortedDateRange.length && sortedDateRange.length > 1) {
        yearsOfExperience = moment.utc(sortedDateRange[sortedDateRange.length - 1]).diff(moment.utc(sortedDateRange[0]), 'years', true);
    } else if (sortedDateRange.length && sortedDateRange.length == 1) {
        yearsOfExperience = moment.utc(sortedDateRange[0]).diff(moment.utc(), 'years', true);
    }

    return Math.round(yearsOfExperience);
};