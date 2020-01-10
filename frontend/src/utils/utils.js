import {Modal} from "antd";
const { confirm } = Modal;

export const submitCreateUpdateForm = (validateFields, thunkFunction, fieldId=null) => {
    validateFields((err, values) => {
        if (!err) {
            const data = {
                ...values,
            };

            if (fieldId)
                data['pk'] = fieldId;

            // create/update domain data
            ['code', 'company', 'manager', 'status', 'domain', 'executors'].forEach(item => {
                values[item]
                    ? data[item] = {pk: values[item]}
                    : data[item] = {}
            });


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