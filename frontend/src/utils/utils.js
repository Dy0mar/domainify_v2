export const submitCreateUpdateForm = (validateFields, thunkFunction, fieldId=null) => {
    validateFields((err, values) => {
        if (!err) {
            const data = {
                ...values,
                pk: fieldId,
            };

            // create/update domain data
            if (values.manager)
                data['manager'] = {pk: values.manager};
            if (values.company)
                data['company'] = {pk: values.company};
            if (values.emails)
                data['emails'] = getDynamic('email', values);
            if (values.telephones)
                data['telephones'] = getDynamic('telephone', values);

            thunkFunction(data);
        }
    });
};

const getDynamic = (field, values) => {
    return Object.keys(values)
        .filter(key => key.startsWith(field+'_'))
        .map(key => {
            const pk = key.split('_')[1];
            if (values[key])
                return { pk: parseInt(pk), [field]: values[key]};
            return undefined
        })
        .filter(i => i !== undefined );
};

export const deleteConfirm = (handleFunction, objTarget, objName) => {
    confirm({
        title: `Are you sure delete ${objName}?`,
        content: 'One does not simply, need confirm',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
            handleFunction(objTarget)
        },
        onCancel() {},
    });
};