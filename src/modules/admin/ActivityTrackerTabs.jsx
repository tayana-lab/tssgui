import AuditTrackerMain from '@app/modules/admin/AuditTrackerMain';
import ProvTrackerMain from '@app/modules/admin/ProvTrackerMain';
import React, {useState} from 'react'
import TssTabs from '@app/modules/common/default/components/TssTabs';
import { useTranslation } from 'react-i18next';

const ActivityTrackerTabs = () =>
{
    const [t]                       = useTranslation();	
    const TABLIST = [
    {
        "Name": t("modules.tracker.auditTracker.label"),
        "Component": <AuditTrackerMain Tabs="System" />,
    },
    {
        "Name": t("modules.tracker.provTracker.tab"),
        "Component": <ProvTrackerMain Tabs="Provisioning" />,
    }
    ];

    return (
        <TssTabs tabsList={TABLIST} defaultTab={t("modules.tracker.auditTracker.label")}/>
    )
}

export default ActivityTrackerTabs

