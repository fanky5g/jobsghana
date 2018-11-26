package util

import (
	"errors"
	"fmt"
	"gopkg.in/mgo.v2/bson"
	"reflect"
)

// FillStruct fills the struct provided as first param with values from map in second param
func FillStruct(s interface{}, m map[string]interface{}) error {
	for k, v := range m {
		err := SetField(s, k, v)
		if err != nil {
			return err
		}
	}
	return nil
}

// SetField sets fields on struct
func SetField(obj interface{}, name string, value interface{}) error {
	structValue := reflect.ValueOf(obj).Elem()
	structFieldValue := structValue.FieldByName(name)

	if !structFieldValue.IsValid() {
		return fmt.Errorf("No such field: %s in obj", name)
	}

	if !structFieldValue.CanSet() {
		return fmt.Errorf("Cannot set %s field value", name)
	}

	structFieldType := structFieldValue.Type()
	val := reflect.ValueOf(value)
	if structFieldType != val.Type() {
		return errors.New("Provided value type didn't match obj field type")
	}

	structFieldValue.Set(val)
	return nil
}

// EnsureFields parses a struct type for required fields and validates
func EnsureFields(f interface{}) error {
	l := reflect.ValueOf(f).NumField()

	for i := 0; i < l; i++ {
		v := reflect.ValueOf(f)
		k := v.Field(i).Kind()

		if k != reflect.Ptr {
			t := v.Type()

			if IsEmpty(v.Field(i).Interface()) {
				r, _ := t.Field(i).Tag.Lookup("validate")
				skipValidate := r == "false"
				if !t.Field(i).Anonymous && !skipValidate {
					return fmt.Errorf("field %s required but missing in %s struct", t.Field(i).Name, t.Name())
				}
			}
		}
	}
	return nil
}

// GetUniqueField returns the first unique field of a struct
func GetUniqueField(p interface{}) (field string, value interface{}) {
	// ensure p is struct
	l := reflect.ValueOf(p).NumField()
	for i := 0; i < l; i++ {
		v := reflect.ValueOf(p)
		k := v.Field(i).Kind()

		if k != reflect.Ptr {
			t := v.Type()

			if !IsEmpty(v.Field(i).Interface()) {
				r, _ := t.Field(i).Tag.Lookup("unique")
				isUnique := r == "true"
				if isUnique {
					field, _ = t.Field(i).Tag.Lookup("bson")
					value = v.Field(i).Interface()
					break
				}
			}
		}
	}
	return
}

// SerializeUpdate returns a map of key value of struct fields that are allowed to update in database
func SerializeUpdate(data interface{}) (out bson.M) {
	l := reflect.ValueOf(data).NumField()
	out = bson.M{}

	for i := 0; i < l; i++ {
		v := reflect.ValueOf(data)
		t := v.Type()
		r, _ := t.Field(i).Tag.Lookup("editable")
		btag, _ := t.Field(i).Tag.Lookup("bson")
		editable := r != "false" && btag != ""
		if !IsEmpty(v.Field(i).Interface()) && editable {
			out[btag] = v.Field(i).Interface()
		}
	}
	return
}
