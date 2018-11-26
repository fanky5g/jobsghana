package util

import "reflect"

// IsEmpty checks if the interface passed is empty
func IsEmpty(object interface{}) bool {
	if object == nil {
		return true
	} else if reflect.Zero(reflect.TypeOf(object)) == object {
		return true
	} else if object == "" {
		return true
	} else if object == false {
		return true
	}

	//Then see if it's a struct
	if reflect.ValueOf(object).Kind() == reflect.Struct {
		// and create an empty copy of the struct object to compare against
		empty := reflect.New(reflect.TypeOf(object)).Elem().Interface()
		if reflect.DeepEqual(object, empty) {
			return true
		}
	}
	return false
}
