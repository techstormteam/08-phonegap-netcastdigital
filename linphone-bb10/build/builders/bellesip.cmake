############################################################################
# belle-sip.cmake
# Copyright (C) 2014  Belledonne Communications, Grenoble France
#
############################################################################
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
#
############################################################################

set(EP_bellesip_GIT_REPOSITORY "git://git.linphone.org/belle-sip.git")
if(${LINPHONE_BUILDER_LATEST})
	set(EP_bellesip_GIT_TAG "master")
else()
	set(EP_bellesip_GIT_TAG "3386feae786453473bcae035957668832b81b561")
endif()
set(EP_bellesip_CMAKE_OPTIONS )
set(EP_bellesip_LINKING_TYPE "-DENABLE_STATIC=0")
set(EP_bellesip_DEPENDENCIES EP_antlr3c EP_polarssl)
if(MSVC)
	set(EP_bellesip_EXTRA_LDFLAGS "/SAFESEH:NO")
endif(MSVC)

if(${ENABLE_TUNNEL})
	list(APPEND EP_bellesip_CMAKE_OPTIONS "-DENABLE_TUNNEL=1")
	list(APPEND EP_bellesip_DEPENDENCIES EP_tunnel)
else(${ENABLE_TUNNEL})
	list(APPEND EP_bellesip_CMAKE_OPTIONS "-DENABLE_TUNNEL=0")
endif(${ENABLE_TUNNEL})
if(${ENABLE_UNIT_TESTS})
	list(APPEND EP_bellesip_DEPENDENCIES EP_cunit)
else(${ENABLE_UNIT_TESTS})
	list(APPEND EP_bellesip_CMAKE_OPTIONS "-DENABLE_TESTS=0")
endif(${ENABLE_UNIT_TESTS})
