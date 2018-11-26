import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import classnames from 'classnames';
import Input from './Input';


function shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

class ListInput extends PureComponent {
	static propTypes = {
		field: PropTypes.string.isRequired,
		index: PropTypes.number,
		keyName: PropTypes.string,
		placeholder: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
		data: PropTypes.array.isRequired,
		onEdit: PropTypes.func.isRequired,
		single: PropTypes.string,
	};

	state = {
		placeholders: [],
	};

	componentDidMount() {
		const { placeholder, data} = this.props;
		if (Array.isArray(placeholder) && data.length) {
			let placeholders = [];
			for (var i = 0; i < data.length; i++) {
				placeholders = [...placeholders, this.getRandPlaceholder()];
			}
			this.setState({
				placeholders: placeholders,
			});
		}
	}

	onFieldChange = (evt) => {
		const { onEdit, field, keyName, index, data } = this.props;
		const localIndex = parseInt(evt.target.id);

		const nextState = [
			...data.slice(0, localIndex),
			evt.target.value,
			...data.slice(localIndex+1),
		];

		onEdit(field, keyName, nextState, index);
	};

	addEntry = () => {
		const { data, onEdit, field, keyName, index, placeholder, className } = this.props;
		if (Array.isArray(placeholder)) {
			this.setState({
				placeholders: [...this.state.placeholders, this.getRandPlaceholder()],
			});
		}

		const nextState = [
			...data,
			'',
		];

		onEdit(field, keyName, nextState, index);
	};

	getRandPlaceholder() {
		const { placeholder } = this.props;
		let randArray = [];
		for (var i = 0; i < placeholder.length; i++) {
			randArray = randArray.concat(i);
		}

		let randIndex = shuffle(randArray)[0];
		return placeholder[randIndex];
	}

	removeEntry = (at) => {
		const { data, onEdit, field, keyName, index, placeholder } = this.props;
		if (Array.isArray(placeholder)) {
			this.setState({
				placeholders: [...this.state.placeholders.splice(0, this.state.placeholders.length - 1)],
			});
		}
		const nextState = [
			...data.splice(0, at),
			...data.splice(at+1),
		];

		onEdit(field, keyName, nextState, index);
	};

	onInputClick = (evt) => {
    	evt.target.readOnly = false;
    	evt.target.onblur = this.onLoseFocus.bind(this);
  	};

  	onLoseFocus = (evt) => {
    	evt.target.readOnly = true;
  	};

	render() {
		const { placeholder, single, data, isMobile, inputWrapperClassName } = this.props;

		return (
			<div className="ListInput">
				{
					data.length > 0 &&
					data.map((entry, d) => {

						let placeh = placeholder;

						if (Array.isArray(placeholder)) {
							placeh = this.state.placeholders[d];
						}

						return (
							(() => {
								if (isMobile) {
									return (
										<div key={d} className="ui-row margin-bottom-20">
											<div className={inputWrapperClassName != undefined? inputWrapperClassName : "col-24"}>
												<Input
													onChange={this.onFieldChange}
													name={d}
													id={d}
													type="text"
													value={entry}
													required={this.props.required}
												/>
												<label placeholder={placeh}></label>
											</div>
											{
							               	  d == data.length - 1 && d > 0 &&
							               	  <span className="display-inline-block right margin-right-15">
								             	 <Button icon="minus-circle" onClick={() => this.removeEntry(d)}/>
								              </span>
							                }
										</div>
									);
								} else {
									return (
										<div key={d} className="margin-top-10 clear">
											<Input
							                 type="text"
							                 className={classnames({"control-input": true, "move-right": true, "display-inline-block": true, "side-has-btn": d == data.length - 1 && d > 0 })}
							                 id={d}
							                 placeholder={placeh}
							                 value={entry}
							                 onChange={this.onFieldChange}
							               />
							               {
							               	 d == data.length - 1 && d > 0 &&
							               	 <span className="margin-left-8 display-inline-block">
								             	<Button icon="minus-circle" shape="circle" onClick={() => this.removeEntry(d)}/>
								             </span>
							               }
										</div>
									);
								}
							})()
						);
					})
				}
				<div className="margin-top-10 clear">
               		<Button className="move-right" icon="plus" onClick={this.addEntry}>{`Add ${single}`}</Button>
               	</div>
			</div>
		);
	}
}

export default ListInput;