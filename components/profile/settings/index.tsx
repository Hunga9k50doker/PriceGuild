import React, { useState } from 'react';
import { Tab, Nav, Row, Col } from 'react-bootstrap'
import ProfileSetting from "components/profile/settings/profileSetting"
import AccountSetting from "components/profile/settings/accountSetting"
import SecuritySetting from "components/profile/settings/securitySetting"
import ConfidentialitySetting from "components/profile/settings/confidentialitySetting"
import { PgAppProfileType } from "interfaces"
import { useSelector } from 'react-redux';
import Selectors from 'redux/selectors';
import { api } from 'configs/axios';
import { useRouter } from 'next/router'

type ParamTypes = {
  action?: string
}

const Settings = () => {
  const router = useRouter();

  const { action }: ParamTypes = router.query;

  const [key, setKey] = useState<string>(action ?? "Profile");

  const { userInfo } = useSelector(Selectors.auth);
  const [profile, setProfile] = useState<PgAppProfileType | undefined>()
  React.useEffect(() => {
    const getUserDetail = async () => {
      try {
        const params = {
          profileid: userInfo.userid
        }
        const res = await api.v1.authorization.pg_profile_setting(params);
        if (res.success) {
          return setProfile(res.data)
        }
        if (!res.success) {
          // @ts-ignore
          if (res.data?.verify_redirect) {
            return router.push('/verify-email')
          }
        }
      } catch (error) {
        console.log("error........", error);
      }
    }
    getUserDetail()
  }, [])

  return (
    <div className="tab-profile-settings">
      <Tab.Container
        activeKey={key}
        onSelect={(k: any) => {
          router.push(`/profile/settings${k === "Profile" ? "" : `/${k}`}`)
          setKey(k)
        }}
        transition={true}
        id="tab-settings"
        defaultActiveKey="Profile">
        <Row>
          <Col xs={12} md={3} className='tab-bar-setting'>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="Profile">Profile</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="account">Account</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="security">Security</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="confidentiality">Confidentiality</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col xs={12} md={9}  className="tab-template-setting">
            <Tab.Content>
              <Tab.Pane eventKey="Profile">
                <ProfileSetting profileData={profile} />
              </Tab.Pane>
              <Tab.Pane eventKey="account">
                <AccountSetting profileData={profile} />
              </Tab.Pane>
              <Tab.Pane eventKey="security">
                <SecuritySetting />
              </Tab.Pane>
              <Tab.Pane eventKey="confidentiality">
                <ConfidentialitySetting profile={profile} setProfile={setProfile} />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default Settings;
